<script setup lang="ts">
import { ref } from 'vue';
import { Head } from '@/lib/inertia-shim';
import { Check } from '@lucide/vue';
import ChainGlyph from '@/components/wallet/ChainGlyph.vue';
import { CHAINS } from '@/lib/wallet-data';
import type { ChainId } from '@/types/wallet';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Wallet', href: '/wallet' },
            { title: 'Upgrade', href: '/wallet/upgrade' },
        ],
    },
});

type TierId = 0 | 1 | 2;

interface Tier {
    id: TierId;
    name: string;
    price: number;
    features: string[];
    highlighted: boolean;
}

const tiers: Tier[] = [
    {
        id: 0,
        name: 'Tier 0',
        price: 0,
        features: [
            'Basic wallet access',
            '2 chains (BTC, ETH)',
            'Standard transaction limits',
            'Email support',
        ],
        highlighted: false,
    },
    {
        id: 1,
        name: 'Tier 1',
        price: 49,
        features: [
            'All 6 chains (BTC, ETH, BNB, TRX, USDT, USDC)',
            'Higher transaction limits',
            'Priority support',
            'Multi-network receive',
            'QR code for each network',
        ],
        highlighted: true,
    },
    {
        id: 2,
        name: 'Tier 2',
        price: 99,
        features: [
            'Everything in Tier 1',
            'Unlimited transaction limits',
            'Priority 24/7 support',
            'Custom fee settings',
            'Multiple addresses per chain',
            'Advanced security features',
        ],
        highlighted: true,
    },
];

const selectedTier = ref<TierId>(1);

const chainList = Object.values(CHAINS);

function selectTier(id: TierId) {
    selectedTier.value = id;
}
</script>

<template>
    <Head title="Upgrade" />

    <div class="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <div>
            <h1 class="text-foreground text-xl font-semibold tracking-tight">
                Upgrade your vault
            </h1>
            <p class="text-vault-ink-dim mt-1 max-w-md text-sm">
                Unlock more chains, higher limits, and premium features by upgrading your tier.
            </p>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div
                v-for="tier in tiers"
                :key="tier.id"
                :class="[
                    'relative border-border rounded-2xl border p-5 transition-all',
                    tier.highlighted
                        ? 'border-vault-mint/40 bg-vault-mint/5 shadow-lg shadow-vault-mint/5'
                        : 'bg-card hover:border-vault-mint/20',
                    selectedTier === tier.id
                        ? 'ring-2 ring-vault-mint ring-offset-2'
                        : '',
                ]"
            >
                <!-- Tier badge -->
                <div class="mb-4 flex items-center justify-between">
                    <span
                        :class="[
                            'text-foreground text-sm font-semibold',
                            tier.highlighted ? 'text-vault-mint' : '',
                        ]"
                    >
                        {{ tier.name }}
                    </span>
                    <span
                        v-if="tier.price === 0"
                        class="text-vault-ink-dim text-sm"
                    >
                        Free
                    </span>
                    <span
                        v-else
                        class="text-foreground font-semibold"
                    >
                        ${{ tier.price }}
                    </span>
                </div>

                <!-- Features list -->
                <ul class="flex flex-col gap-2.5 text-sm">
                    <li
                        v-for="feature in tier.features"
                        :key="feature"
                        class="flex items-center gap-2.5"
                    >
                        <Check
                            :class="[
                                'shrink-0',
                                tier.highlighted
                                    ? 'text-vault-mint'
                                    : 'text-vault-ink-dim',
                                'size-4',
                            ]"
                        />
                        <span
                            :class="[
                                'min-w-0',
                                tier.highlighted ? 'text-foreground' : 'text-vault-ink-dim',
                            ]"
                        >
                            {{ feature }}
                        </span>
                    </li>
                </ul>

                <!-- Selected indicator -->
                <div
                    v-if="selectedTier === tier.id"
                    class="mt-4 flex items-center gap-2 text-vault-mint text-xs font-medium"
                >
                    <Check class="size-3.5" />
                    Selected
                </div>

                <!-- Select button -->
                <button
                    type="button"
                    @click="selectTier(tier.id)"
                    :disabled="selectedTier === tier.id"
                    class="mt-4 w-full rounded-xl border px-4 py-2.5 text-center text-sm font-semibold transition-colors"
                    :class="[
                        selectedTier === tier.id
                            ? 'border-vault-mint/30 bg-vault-mint/10 text-vault-mint cursor-default'
                            : tier.highlighted
                                ? 'border-vault-mint/30 bg-vault-mint text-primary-foreground hover:bg-vault-mint/90'
                                : 'border-border bg-secondary hover:bg-secondary/80 text-foreground',
                    ]"
                >
                    {{ tier.price === 0 ? 'Current plan' : 'Select plan' }}
                </button>
            </div>
        </div>

        <!-- Chains available per tier -->
        <div class="border-border bg-card rounded-2xl border p-5">
            <p class="text-foreground mb-4 text-sm font-medium">
                Chains included
            </p>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div
                    v-for="chain in chainList"
                    :key="chain.id"
                    class="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3"
                >
                    <ChainGlyph :chain="chain.id" size="md" />
                    <div class="min-w-0">
                        <p class="text-foreground text-sm font-medium truncate">
                            {{ chain.symbol }}
                        </p>
                        <p class="text-vault-ink-dim text-xs truncate">
                            {{ chain.name }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
