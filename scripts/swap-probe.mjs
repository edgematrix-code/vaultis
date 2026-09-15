// Usage: node scripts/swap-probe.mjs <baseUrl> [waitSeconds]
// Verifies the swap page token dropdowns: opens them, lists items, swaps token.
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const base = process.argv[2] ?? 'http://localhost:4173';
const waitMs = Number(process.argv[3] ?? '6000');
const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const PORT = Number(process.env.CDP_PORT ?? '9420');

const userDataDir = mkdtempSync(join(tmpdir(), 'cdp-swap-'));
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
    } catch { /* not ready */ }
    await sleep(300);
  }
  throw new Error('Could not connect to Chrome debugger');
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
    }
  };
  const send = (method, params = {}) => new Promise((resolve) => {
    const id = ++msgId;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });

  const evaluate = async (expression) => {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    return res.result?.result?.value;
  };

  await send('Runtime.enable');
  await send('Page.enable');
  console.log(`\n=== swap probe: ${base}/wallet/swap ===\n`);
  await send('Page.navigate', { url: `${base}/wallet/swap` });
  await sleep(waitMs);

  // --- 1. Initial state ---
  console.log('--- initial state ---');
  console.log(await evaluate(`(() => {
    const triggers = [...document.querySelectorAll('[data-slot=select-trigger]')];
    return JSON.stringify({
      triggers: triggers.length,
      fromToken: triggers[0]?.textContent.trim().replace(/\\s+/g, ' '),
      toToken: triggers[1]?.textContent.trim().replace(/\\s+/g, ' '),
      rate: [...document.querySelectorAll('div')].reverse().find(d => d.textContent.includes('per 1'))?.textContent.trim().replace(/\\s+/g, ' ').slice(0, 120) ?? '—',
    }, null, 1);
  })()`));

  // --- 2. Open the From dropdown via keyboard ---
  console.log('\n--- open FROM dropdown ---');
  await evaluate(`(() => {
    const t = document.querySelectorAll('[data-slot=select-trigger]')[0];
    t.focus();
    return document.activeElement === t;
  })()`);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await sleep(700);
  console.log(await evaluate(`(() => {
    const items = [...document.querySelectorAll('[data-slot=select-item]')];
    return JSON.stringify({
      open: !!document.querySelector('[data-slot=select-content]'),
      itemCount: items.length,
      items: items.map(i => i.textContent.trim().replace(/\\s+/g, ' ')),
      disabledItems: items.filter(i => i.getAttribute('data-disabled') != null).map(i => i.textContent.trim().split(/\\s+/)[0]),
    }, null, 1);
  })()`));

  // --- 3. Select SOL (navigate: BTC is first, SOL is 5th) ---
  console.log('\n--- select SOL from FROM dropdown ---');
  for (let i = 0; i < 5; i++) {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowDown', code: 'ArrowDown', windowsVirtualKeyCode: 40 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowDown', code: 'ArrowDown', windowsVirtualKeyCode: 40 });
    await sleep(60);
  }
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await sleep(800);
  console.log(await evaluate(`(() => {
    const triggers = [...document.querySelectorAll('[data-slot=select-trigger]')];
    return JSON.stringify({
      fromToken: triggers[0]?.textContent.trim().replace(/\\s+/g, ' '),
      toToken: triggers[1]?.textContent.trim().replace(/\\s+/g, ' '),
    });
  })()`));

  // --- 4. Open the To dropdown and select BNB ---
  console.log('\n--- open TO dropdown, select BNB ---');
  await evaluate(`(() => {
    document.querySelectorAll('[data-slot=select-trigger]')[1].focus();
  })()`);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await sleep(700);
  const toItems = await evaluate(`(() => {
    const items = [...document.querySelectorAll('[data-slot=select-item]')];
    return items.length;
  })()`);
  console.log(`to dropdown items: ${toItems}`);
  for (let i = 0; i < 2; i++) {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowDown', code: 'ArrowDown', windowsVirtualKeyCode: 40 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowDown', code: 'ArrowDown', windowsVirtualKeyCode: 40 });
    await sleep(60);
  }
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await sleep(800);

  // --- 5. Final state + enter an amount to see the estimate ---
  console.log('\n--- final state ---');
  await evaluate(`(() => {
    const inp = document.querySelector('input[inputmode=decimal]');
    inp.focus();
    return true;
  })()`);
  await send('Input.insertText', { text: '25' });
  await sleep(1200);
  console.log(await evaluate(`(() => {
    const triggers = [...document.querySelectorAll('[data-slot=select-trigger]')];
    const text = document.body.innerText.replace(/\\n+/g, ' | ');
    return JSON.stringify({
      fromToken: triggers[0]?.textContent.trim().replace(/\\s+/g, ' '),
      toToken: triggers[1]?.textContent.trim().replace(/\\s+/g, ' '),
      estimateShown: /You'll receive approx/.test(text),
      usdShown: /≈ \\$/.test(text),
      swapBtnEnabled: [...document.querySelectorAll('button')].some(b => b.textContent.trim() === 'Swap' && !b.disabled),
      rateLine: (text.match(/[^|]*per 1 [A-Z]+/) ?? ['—'])[0].trim().slice(0, 120),
    }, null, 1);
  })()`));
} finally {
  try { chrome.kill(); } catch { /* noop */ }
  try { rmSync(userDataDir, { recursive: true, force: true }); } catch { /* noop */ }
}
process.exit(0);
