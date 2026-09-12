import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, '../dist');

// Poll until index.html stops changing (vite-plus may still be writing files)
let last = '';
for (let i = 0; i < 20; i++) {
  const content = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  if (content === last) {
    console.log('[post-build] index.html stable after', i + 1, 'checks');
    break;
  }
  last = content;
  await new Promise((r) => setTimeout(r, 300));
}

fs.writeFileSync(path.join(dist, '404.html'), last);
console.log('[post-build] 404.html synced from index.html');
