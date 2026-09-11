<script setup lang="ts">
import { ref } from 'vue';
import { Head } from '@/lib/inertia-shim';
import { router } from '@/lib/inertia-shim';
import { AlertTriangle, Loader2, Check } from '@lucide/vue';
import ChainGlyph from '@/components/wallet/ChainGlyph.vue';
import { CHAINS } from '@/lib/wallet-data';
import type { ChainId } from '@/types/wallet';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Wallet', href: '/wallet' },
            { title: 'Upgrade', href: '/wallet/upgrade' },
            { title: 'Fund verification', href: '/wallet/upgrade/fund' },
        ],
    },
});

// The 4 stablecoin options (USDT + USDC across chains)
const stableOptions = [
    {
        id: 'usdt-erc' as ChainId,
        label: 'USDT — Ethereum (ERC-20)',
        chainName: 'Ethereum',
        symbol: 'USDT',
    },
    {
        id: 'usdt-bsc' as ChainId,
        label: 'USDT — BNB Smart Chain (BEP-20)',
        chainName: 'BNB Smart Chain',
        symbol: 'USDT',
    },
    {
        id: 'usdt-trc' as ChainId,
        label: 'USDT — Tron (TRC-20)',
        chainName: 'Tron',
        symbol: 'USDT',
    },
    {
        id: 'usdc-eth' as ChainId,
        label: 'USDC — Ethereum (ERC-20)',
        chainName: 'Ethereum',
        symbol: 'USDC',
    },
];

const selected = ref<ChainId | null>(null);
const proceedLoading = ref(false);

function proceed() {
    if (!selected.value) return;
    proceedLoading.value = true;
    setTimeout(() => {
        proceedLoading.value = false;
        router.visit(`/wallet/upgrade/deposit/${selected.value}`);
    }, 500);
}
</script>

<template>
    <Head title="Fund verification" />

    <div class="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <div>
            <h1 class="text-foreground text-xl font-semibold tracking-tight">
                Fund your verification
            </h1>
            <p class="text-vault-ink-dim mt-1 max-w-lg text-sm">
                To activate Tier 2 withdrawal features, you need to deposit
                <strong class="text-foreground">$500</strong> in stablecoins.
                Choose a stablecoin below to continue.
            </p>
        </div>

        <!-- Warning banner -->
        <div
            class="flex items-start gap-3 rounded-xl border border-vault-amber/30 bg-vault-amber/10 p-4 text-xs"
        >
            <AlertTriangle class="mt-0.5 size-4 shrink-0 text-vault-amber" />
            <div class="text-vault-amber/90">
                <p class="font-semibold">You are about to fund your account</p>
                <p class="mt-1 text-vault-amber/70">
                    A deposit of <strong>$500</strong> in stablecoins is required
                    to verify your identity and unlock Tier 2 withdrawal features.
                </p>
            </div>
        </div>

        <!-- Stablecoin options -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
                v-for="opt in stableOptions"
                :key="opt.id"
                type="button"
                @click="selected = (selected === opt.id ? null : opt.id)"
                :class="[
                    'relative flex w-full flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all',
                    selected === opt.id
                        ? 'border-vault-mint/50 bg-vault-mint/10 shadow-md shadow-vault-mint/5'
                        : 'border-border bg-card hover:border-vault-mint/20',
                ]"
            >
                <!-- Selected indicator -->
                <div
                    v-if="selected === opt.id"
                    class="absolute right-3 top-3 flex items-center gap-1 text-vault-mint text-xs font-medium"
                >
                    <Check class="size-3.5" />
                    Selected
                </div>

                <div class="flex items-center gap-3 w-full">
                    <ChainGlyph :chain="opt.id" size="md" />
                    <div class="min-w-0">
                        <p class="text-foreground text-sm font-semibold">
                            {{ opt.label }}
                        </p>
                        <p class="text-vault-ink-dim text-xs">
                            {{ opt.chainName }} · {{ opt.symbol }}
                        </p>
                    </div>
                </div>

                <p class="text-vault-ink-dim text-xs">
                    Deposit <strong>$500</strong> {{ opt.symbol }} to verify
                </p>
            </button>
        </div>

        <!-- Proceed button -->
        <div class="flex flex-col gap-3">
            <button
                type="button"
                @click="proceed"
                :disabled="!selected || proceedLoading"
                class="w-full rounded-xl border px-4 py-3 text-sm font-semibold transition-colors"
                :class="[
                    !selected
                        ? 'border-border bg-secondary text-vault-ink-dim cursor-not-allowed'
                        : proceedLoading
                            ? 'border-border bg-secondary text-vault-ink-dim cursor-not-allowed'
                            : 'border-vault-mint/30 bg-vault-mint text-primary-foreground hover:bg-vault-mint/90',
                ]"
            >
                <template v-if="proceedLoading">
                    <Loader2 class="size-4 inline mr-2 animate-spin" />
                    Loading…
                </template>
                <template v-else>
                    Proceed
                </template>
            </button>

            <p v-if="!selected" class="text-vault-ink-dim text-xs text-center">
                Select a stablecoin above to continue
            </p>
        </div>
    </div>
</template>
