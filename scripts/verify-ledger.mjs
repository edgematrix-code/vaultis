// Run with: node --experimental-strip-types scripts/verify-ledger.mjs
// (or: npx tsx scripts/verify-ledger.mjs)
import { MOCK_BALANCES, MOCK_TRANSACTIONS, MOCK_HISTORY } from '../resources/js/lib/data.ts';

const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

let ok = true;
let total = 0;
const nets = {};
for (const t of MOCK_TRANSACTIONS) {
    if (t.status !== 'completed') continue;
    nets[t.chain] = (nets[t.chain] ?? 0) + (t.type === 'deposit' ? t.amount : -t.amount);
}
console.log('chain      balance      deposits-withdrawals   usdValue      match');
for (const b of MOCK_BALANCES) {
    const net = nets[b.chain];
    const m = Math.abs(net - b.balance) < 1e-9;
    if (!m) ok = false;
    total += b.usdValue;
    console.log(
        `${b.chain.padEnd(10)} ${String(b.balance).padEnd(12)} ${String(net).padEnd(22)} ${fmt(b.usdValue).padEnd(13)} ${m ? 'OK' : 'MISMATCH'}`,
    );
}
console.log('---');
console.log('TOTAL usdValue:', fmt(total), total === 1834763.18 ? '(EXACT 1,834,763.18)' : '(WRONG!)');
if (total !== 1834763.18) ok = false;

const histLast = MOCK_HISTORY[MOCK_HISTORY.length - 1];
console.log('History last:', fmt(histLast.value), histLast.value === total ? '(ends at total OK)' : '(HISTORY MISMATCH!)');
if (histLast.value !== total) ok = false;

const w = [...MOCK_TRANSACTIONS].filter((t) => t.type === 'withdrawal' && t.status === 'completed')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
const days = (Date.now() - new Date(w.createdAt)) / 86400000;
console.log('Latest completed withdrawal:', w.id, new Date(w.createdAt).toISOString().slice(0, 10), `(${(days / 365.25).toFixed(2)} years ago)`);
if (Math.abs(days / 365.25 - 2) > 0.05) { ok = false; console.log('NOT ~2 YEARS AGO!'); }

const dep = MOCK_TRANSACTIONS.filter((t) => t.type === 'deposit' && t.status === 'completed');
const depUsd = dep.reduce((s, t) => s + t.usdValue, 0);
const wdUsd = MOCK_TRANSACTIONS.filter((t) => t.type === 'withdrawal' && t.status === 'completed').reduce((s, t) => s + t.usdValue, 0);
console.log('Completed deposits:', dep.length, '· total withdrawn:', fmt(wdUsd));
const usdNet = depUsd - wdUsd;
console.log('USD deposits − withdrawals =', fmt(usdNet), Math.abs(usdNet - total) < 0.005 ? '(✅ equals portfolio total)' : `(❌ off by ${(usdNet - total).toFixed(2)})`);
if (Math.abs(usdNet - total) >= 0.005) ok = false;
console.log(ok ? '\n✅ ALL CHECKS PASS' : '\n❌ CHECKS FAILED');
process.exit(ok ? 0 : 1);
