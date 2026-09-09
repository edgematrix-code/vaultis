<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Head } from '@/lib/inertia-shim';
import {
    ChevronDown,
    ChevronLeft,
    Loader2,
    AlertTriangle,
    Check,
    Coins,
} from '@lucide/vue';
import ChainGlyph from '@/components/wallet/ChainGlyph.vue';
import { CHAINS, formatUsd, formatCrypto, formatUsdPrice } from '@/lib/wallet-data';
import { useSwapRates } from '@/composables/useSwapRates';
import type { ChainId } from '@/types/wallet';
import type { AssetBalance } from '@/types/wallet';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Wallet', href: '/wallet' },
            { title: 'Swap', href: '/wallet/swap' },
        ],
    },
});

const { prices, loading: ratesLoading, estimate, rate } = useSwapRates();

// Available tokens for swap (all 6 supported chains)
const tokens = computed(() => Object.values(CHAINS));

// Swap direction: 'src->dst'
const direction = ref<'src->dst'>('src->dst');
const srcChain = ref<ChainId>('btc');
const dstChain = ref<ChainId>('eth');

// Amounts
const srcAmount = ref<string>('');
const dstAmount = ref<string>('');

const enteredAmount = computed(() => {
    const v = parseFloat(srcAmount.value);
    return Number.isFinite(v) && v > 0 ? v : null;
});

const maxSrcAmount = ref<number>(0);

// Mock balances used to compute "max"
const mockBalances = ref<Record<ChainId, number>>({
    btc: 0.002345,
    eth: 0.0842,
    bsc: 0.4215,
    trx: 125.75,
    usdt: 42.5,
    usdc: 88.0,
});

// Which token is currently being topped up from (used for max button)
const srcBalance = computed(() => mockBalances.value[srcChain.value] ?? 0);

function swapDirection() {
    const tmp = srcChain.value;
    srcChain.value = dstChain.value;
    dstChain.value = tmp;
    // Keep amount text, but re-evaluate rate
}

function srcChainChanged() {
    // Avoid same chain swap
    if (srcChain.value === dstChain.value) {
        // rotate to next
        const all = Object.keys(CHAINS) as ChainId[];
        const idx = all.indexOf(srcChain.value);
        dstChain.value = all[(idx + 1) % all.length];
    }
    tryUpdateEstimate();
}

function dstChainChanged() {
    tryUpdateEstimate();
}

function tryUpdateEstimate() {
    const amt = enteredAmount.value;
    if (amt == null) {
        dstAmount.value = '';
        return;
    }
    const est = estimate.value(srcChain.value, dstChain.value, amt);
    dstAmount.value = est == null ? '' : formatCrypto(est, 6);
}

// Debounced update via watch
watch(srcAmount, () => {
    tryUpdateEstimate();
});

watch([srcChain, dstChain], () => {
    tryUpdateEstimate();
});

// Rate display
const rateDisplay = computed(() => {
    const r = rate.value(srcChain.value, dstChain.value);
    if (r == null) return '—';
    // show how much dst you receive per 1 src
    return `${formatCrypto(r, 6)} ${CHAINS[dstChain.value].symbol} per 1 ${CHAINS[srcChain.value].symbol}`;
});

const rateLoading = computed(() => ratesLoading.value);

// Transaction state
type SwapState = 'idle' | 'confirming' | 'processing' | 'done' | 'error';
const state = ref<SwapState>('idle');
const txHash = ref<string>('');
const txError = ref<string>('');
const processing = ref(false);

function startSwap() {
    state.value = 'confirming';
}

function confirmSwap() {
    if (state.value !== 'confirming') return;
    state.value = 'processing';
    processing.value = true;
    txError.value = '';

    // Simulate a swap "transaction"
    setTimeout(() => {
        processing.value = false;
        // random outcome for demo
        if (Math.random() < 0.05) {
            state.value = 'error';
            txError.value = 'Network error — please try again.';
            return;
        }
        txHash.value = '0x' + Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
        ).join('');
        state.value = 'done';
    }, 1800);
}

function resetSwap() {
    state.value = 'idle';
    txHash.value = '';
    txError.value = '';
    srcAmount.value = '';
    dstAmount.value = '';
}

const disableSwap = computed(() => {
    const amt = enteredAmount.value;
    if (amt == null || amt <= 0) return true;
    if (srcChain.value === dstChain.value) return true;
    return false;
});

const summary = computed(() => {
    const amt = enteredAmount.value ?? 0;
    const est = dstAmount.value ? parseFloat(dstAmount.value) : 0;
    return `${formatCrypto(amt, 6)} ${CHAINS[srcChain.value].symbol} → ${formatCrypto(est, 6)} ${CHAINS[dstChain.value].symbol}`;
});
</script>

<template>
    <Head title="Swap" />

    <div class="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 p-4 md:p-6">
        <!-- Header -->
        <div>
            <h1 class="text-foreground text-xl font-semibold tracking-tight">
                Swap
            </h1>
            <p class="text-vault-ink-dim mt-1 text-sm">
                Exchange one asset for another using live rates.
            </p>
        </div>

        <!-- From / To selector -->
        <div class="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5">
            <!-- From -->
            <div>
                <p class="text-foreground text-xs font-semibold uppercase tracking-wide">
                    From
                </p>
                <div class="mt-2 flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3">
                    <button
                        type="button"
                        @click="direction = direction === 'src->dst' ? 'dst->src' : 'src->dst'"
                        class="shrink-0 text-vault-ink-dim transition-colors hover:text-vault-mint"
                    >
                        <ChevronDown class="size-5" />
                    </button>
                    <ChainGlyph :chain="srcChain" size="sm" />
                    <div class="min-w-0 flex-1">
                        <p class="text-foreground text-sm font-medium">
                            {{ CHAINS[srcChain].symbol }}
                        </p>
                        <p class="text-vault-ink-dim text-xs">
                            {{ CHAINS[srcChain].name }}
                        </p>
                    </div>
                    <!-- Balance chip -->
                    <div class="text-right">
                        <p class="text-foreground text-sm font-medium">
                            {{ formatCrypto(srcBalance, CHAINS[srcChain].decimals) }}
                        </p>
                        <button
                            type="button"
                            @click="srcAmount = String(srcBalance)"
                            class="text-vault-ink-dim text-xs hover:text-vault-mint"
                        >
                            Max
                        </button>
                    </div>
                </div>
            </div>

            <!-- Arrow (only when direction is src->dst, otherwise swap button) -->
            <div class="flex justify-center">
                <button
                    v-if="direction === 'src->dst'"
                    type="button"
                    @click="swapDirection"
                    class="flex size-9 items-center justify-center rounded-full border border-vault-mint/30 bg-vault-mint/10 text-vault-mint hover:bg-vault-mint/20"
                >
                    <ChevronLeft class="size-4" />
                </button>
                <span v-else class="text-vault-ink-dim text-sm">
                    Swapped
                </span>
            </div>

            <!-- To -->
            <div>
                <p class="text-foreground text-xs font-semibold uppercase tracking-wide">
                    To
                </p>
                <div class="mt-2 flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3">
                    <ChainGlyph :chain="dstChain" size="sm" />
                    <div class="min-w-0 flex-1">
                        <p class="text-foreground text-sm font-medium">
                            {{ CHAINS[dstChain].symbol }}
                        </p>
                        <p class="text-vault-ink-dim text-xs">
                            {{ CHAINS[dstChain].name }}
                        </p>
                    </div>
                    <div class="text-right">
                        <p class="text-vault-ink-dim text-sm">
                            —
                        </p>
                    </div>
                </div>
            </div>

            <!-- Rate info -->
            <div class="border-border bg-secondary/30 rounded-xl border px-4 py-3 text-center text-sm">
                <div v-if="rateLoading" class="flex items-center justify-center gap-2 text-vault-ink-dim">
                    <Loader2 class="size-4 animate-spin" />
                    <span>Loading rate…</span>
                </div>
                <div v-else class="text-foreground">
                    <span class="font-medium">{{
                        rateDisplay
                    }}</span>
                </div>
            </div>

            <!-- Amount input -->
            <div class="flex flex-col gap-3">
                <label class="text-foreground text-xs font-semibold uppercase tracking-wide">
                    Amount
                </label>
                <div class="flex rounded-xl border border-border bg-secondary/40 p-1 focus-within:border-vault-mint/40 focus-within:ring-1 focus-within:ring-vault-mint/30 transition-colors">
                    <input
                        v-model="srcAmount"
                        @input="tryUpdateEstimate"
                        type="text"
                        inputmode="decimal"
                        placeholder="0.00"
                        class="flex-1 bg-transparent text-foreground text-lg font-semibold outline-none placeholder:text-vault-ink-dim"
                    />
                    <span class="shrink-0 text-foreground text-sm font-medium">
                        {{ CHAINS[srcChain].symbol }}
                    </span>
                </div>

                <!-- Estimated receive -->
                <div v-if="dstAmount" class="text-vault-ink-dim text-sm">
                    You'll receive approx.
                    <span class="text-foreground font-medium">
                        {{ dstAmount }}
                    </span>
                    {{ CHAINS[dstChain].symbol }}
                </div>
            </div>

            <!-- Swap button -->
            <button
                type="button"
                @click="startSwap"
                :disabled="disableSwap"
                :class="[
                    'w-full rounded-xl border px-4 py-3 text-sm font-semibold transition-colors',
                    disableSwap
                        ? 'border-border bg-secondary text-vault-ink-dim cursor-not-allowed'
                        : 'border-vault-mint/30 bg-vault-mint text-primary-foreground hover:bg-vault-mint/90',
                ]"
            >
                {{ disableSwap && srcChain === dstChain ? 'Select a different token' : 'Swap' }}
            </button>
        </div>

        <!-- Confirmation dialog -->
        <div
            v-if="state === 'confirming'"
            class="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5"
        >
            <div class="flex items-start gap-3">
                <AlertTriangle class="mt-0.5 shrink-0 text-vault-amber size-5" />
                <div class="min-w-0">
                    <p class="text-foreground text-sm font-semibold">Confirm swap</p>
                    <p class="text-vault-ink-dim text-xs mt-0.5">
                        This is a demo transaction. Review the details before sending.
                    </p>
                </div>
            </div>

            <div class="border-border bg-secondary/30 rounded-xl border p-4 text-sm">
                <div class="flex items-center gap-2 text-vault-ink-dim">
                    <Coins class="size-4" />
                    <span class="text-foreground font-medium">{{ summary }}</span>
                </div>
                <div class="mt-3 flex items-center gap-2 text-vault-ink-dim">
                    <span>Rate:</span>
                    <span class="text-foreground">{{ rateDisplay }}</span>
                </div>
            </div>

            <div class="flex gap-3">
                <button
                    type="button"
                    @click="state = 'idle'"
                    class="flex-1 rounded-xl border border-border bg-secondary text-foreground text-sm font-semibold hover:bg-secondary/80"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    @click="confirmSwap"
                    :disabled="processing"
                    class="flex-1 rounded-xl border border-vault-mint/30 bg-vault-mint text-primary-foreground text-sm font-semibold hover:bg-vault-mint/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {{ processing ? 'Sending…' : 'Confirm swap' }}
                </button>
            </div>
        </div>

        <!-- Processing spinner -->
        <div
            v-if="state === 'processing'"
            class="border-border bg-card flex flex-col items-center gap-4 rounded-2xl border p-8 text-center"
        >
            <Loader2 class="size-8 animate-spin text-vault-mint" />
            <p class="text-foreground text-sm font-medium">Processing swap…</p>
            <p class="text-vault-ink-dim text-xs">
                This may take a few moments.
            </p>
        </div>

        <!-- Result -->
        <div
            v-if="state === 'done'"
            class="border-border bg-vault-mint/10 flex flex-col gap-4 rounded-2xl border p-5 text-center"
        >
            <div class="flex items-center justify-center gap-2 text-vault-mint">
                <Check class="size-5" />
                <span class="text-foreground font-semibold">Swap complete</span>
            </div>
            <p class="text-vault-ink-dim text-sm">
                {{ summary }}
            </p>
            <p class="text-vault-ink-dim text-xs">
                Tx:
                <span
                    class="text-foreground"
                    :title="txHash"
                >
                    {{ txHash.slice(0, 10) }}…
                </span>
            </p>
            <button
                type="button"
                @click="resetSwap"
                class="w-full rounded-xl border border-border bg-secondary text-foreground text-sm font-semibold hover:bg-secondary/80"
            >
                Swap again
            </button>
        </div>

        <!-- Error -->
        <div
            v-if="state === 'error'"
            class="border-border bg-vault-rose/10 flex flex-col gap-4 rounded-2xl border p-5 text-center"
        >
            <div class="flex items-center justify-center gap-2 text-vault-rose">
                <AlertTriangle class="size-5" />
                <span class="text-foreground font-semibold">Swap failed</span>
            </div>
            <p class="text-vault-ink-dim text-sm">
                {{ txError || 'Something went wrong.' }}
            </p>
            <button
                type="button"
                @click="resetSwap"
                class="w-full rounded-xl border border-border bg-secondary text-foreground text-sm font-semibold hover:bg-secondary/80"
            >
                Try again
            </button>
        </div>
    </div>
</template>
