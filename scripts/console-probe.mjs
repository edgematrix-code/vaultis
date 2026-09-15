// Usage: node scripts/console-probe.mjs <url> [waitSeconds]
// Launches headless Chrome, loads <url>, prints console output, exits.
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const url = process.argv[2] ?? 'http://localhost:5173/login';
const waitMs = Number(process.argv[3] ?? '8000');
const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const PORT = Number(process.env.CDP_PORT ?? '9223');

const userDataDir = mkdtempSync(join(tmpdir(), 'cdp-probe-'));
const chrome = spawn(CHROME, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${userDataDir}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-gpu',
  '--window-size=1400,900',
  'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getDebuggerUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const targets = await res.json();
      const page = targets.find((t) => t.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch { /* chrome not ready yet */ }
    await sleep(300);
  }
  throw new Error('Could not connect to Chrome debugger');
}

function stamp() {
  return new Date().toISOString().slice(11, 23);
}

let ws;
try {
  const wsUrl = await getDebuggerUrl();
  ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });

  let msgId = 0;
  const pending = new Map();
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
      return;
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      const { type, args, timestamp } = msg.params;
      const text = args.map((a) => {
        if (a.type === 'string') return a.value;
        if (a.type === 'object') {
          const desc = a.description ?? a.preview?.description ?? '';
          return desc.length > 3000 ? desc.slice(0, 3000) + '…' : desc;
        }
        return String(a.value ?? a.type);
      }).join(' ');
      const icon = { error: '❌', warning: '⚠️', log: '·', info: 'ℹ️' }[type] ?? '·';
      console.log(`[${stamp()}] ${icon} [${type}] ${text}`);
    } else if (msg.method === 'Runtime.exceptionThrown') {
      const d = msg.params.exceptionDetails;
      const text = d.exception?.description ?? d.text;
      console.log(`[${stamp()}] 💥 [exception] ${text}`);
    } else if (msg.method === 'Log.entryAdded') {
      const e = msg.params.entry;
      console.log(`[${stamp()}] 📄 [${e.level}] ${e.source}: ${e.text} ${e.url ?? ''}`);
    } else if (msg.method === 'Runtime.bindingCalled') {
      console.log(`[${stamp()}] 🔗 [binding] ${msg.params.payload}`);
    }
  };

  const send = (method, params = {}) => new Promise((resolve) => {
    const id = ++msgId;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });

  await send('Runtime.enable');
  await send('Log.enable');
  await send('Page.enable');
  await send('Network.enable');

  // Track failed requests
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.method === 'Network.responseReceived') {
      const { status, url: u } = msg.params.response;
      if (status >= 400) console.log(`[${stamp()}] 🚫 [http ${status}] ${u}`);
    }
  });

  console.log(`\n=== probing ${url} ===\n`);
  await send('Page.navigate', { url });

  await sleep(waitMs);

  // Snapshot what actually rendered
  const evalRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const app = document.getElementById('app');
      return JSON.stringify({
        url: location.href,
        title: document.title,
        appChildCount: app ? app.children.length : -1,
        appHTMLLength: app ? app.innerHTML.length : -1,
        firstElements: app ? [...app.children].slice(0, 3).map(c => c.tagName + '.' + (c.className && typeof c.className === 'string' ? c.className.split(' ').slice(0,3).join('.') : '')) : [],
        asideSvgCount: app ? app.querySelectorAll('aside svg, nav svg').length : -1,
        iframeCount: document.querySelectorAll('iframe').length,
        iframeSrc: document.querySelector('iframe')?.src ?? null,
        bodyText: document.body.innerText.slice(0, 4000).replace(/\\n+/g, ' | '),
      }, null, 1);
    })()`,
    returnByValue: true,
  });
  console.log('\n=== DOM snapshot ===');
  console.log(evalRes.result?.result?.value ?? JSON.stringify(evalRes));
} finally {
  try { chrome.kill(); } catch { /* noop */ }
  try { rmSync(userDataDir, { recursive: true, force: true }); } catch { /* noop */ }
}
process.exit(0);
