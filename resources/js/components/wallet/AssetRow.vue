<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { Link } from '@/lib/inertia-shim';
import ChainGlyph from '@/components/wallet/ChainGlyph.vue';
import { CHAINS, formatCrypto, formatPct, formatUsd } from '@/lib/wallet-data';
import { useCoinGecko } from '@/composables/useCoinGecko';
import type { AssetBalance, ChainId } from '@/types/wallet';

const props = defineProps<{
    balance: AssetBalance;
}>();

const chain = computed(() => CHAINS[props.balance.chain]);

// Create a fresh coinGecko instance for this specific chain
const { prices } = useCoinGecko([props.balance.chain]);

const prevPrice = ref<number | null>(null);
const flashClass = ref<string>('');

// Directly access the prices ref for this chain - reactive
const currentPriceData = computed(() => prices.value[props.balance.chain]);
const priceUsd = computed(() => currentPriceData.value?.usd ?? 0);
const priceChange24h = computed(() => currentPriceData.value?.usd_24h_change ?? 0);

onMounted(() => {
    prevPrice.value = priceUsd.value;
    console.log(`[AssetRow:${props.balance.chain}] Mounted`);
    console.log(`[AssetRow:${props.balance.chain}] Initial priceUsd:`, priceUsd.value);
    console.log(`[AssetRow:${props.balance.chain}] Initial currentPriceData:`, currentPriceData.value);
});

// Debug: log anytime prices change
if (import.meta.client) {
    watch(prices, (newPrices) => {
        console.log(`[AssetRow:${props.balance.chain}] Global prices updated:`, newPrices);
    }, { immediate: true });
};

// Watch for price changes and trigger flash animation
watch(
    priceUsd,
    (newPrice) => {
        console.log(`[AssetRow:${props.balance.chain}] Price update: $${newPrice}`);
        if (prevPrice.value !== null && newPrice !== prevPrice.value) {
            flashClass.value = newPrice > prevPrice.value ? 'price-flash-up' : 'price-flash-down';
            setTimeout(() => {
                flashClass.value = '';
            }, 600);
        }
        prevPrice.value = newPrice;
    }
);

const isPositive = computed(() => priceChange24h.value >= 0);

const isStables = computed(() => props.balance.chain === 'usdt-erc' || props.balance.chain === 'usdt-trc' || props.balance.chain === 'usdt-bsc' || props.balance.chain === 'usdc-eth');

const priceColor = computed(() => {
    // Stablecoins: price is effectively $1.00 — show as mint/green.
    if (isStables.value) {
        return 'text-vault-mint';
    }
    return isPositive.value ? 'text-vault-mint' : 'text-vault-rose';
});

const priceDisplay = computed(() => {
    const price = priceUsd.value;
    if (isStables.value) {
        return '$1.00';
    }
    if (price === 0 || !currentPriceData.value) {
        return '—';
    }
    if (price < 1) {
        return '$' + price.toFixed(6);
    }
    if (price < 100) {
        return '$' + price.toFixed(2);
    }
    return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
});

const isLoading = computed(() => currentPriceData.value === null);

const priceChangeDisplay = computed(() => {
    const change = priceChange24h.value;
    if (change === 0 && priceUsd.value === 0) {
        return '...';
    }
    const sign = change >= 0 ? '+' : '';
    return sign + change.toFixed(2) + '%';
});

const changeColor = computed(() => {
    // 24h change shown as yellow/amber for all assets.
    return 'text-vault-amber';
});
</script>

<template>
    <Link
        :href="`/wallet/receive?chain=${balance.chain}`"
        class="hover:bg-secondary/60 flex flex-col gap-1 rounded-xl px-4 py-4 transition-colors"
    >
        <div class="flex items-center gap-3">
            <ChainGlyph :chain="chain.id" />

            <div class="min-w-0">
                <p class="text-foreground text-sm font-medium">
                    {{ chain.name }}
                </p>
                <p class="text-vault-ink-dim text-xs">{{ chain.network }}</p>
            </div>
        </div>

        <div class="hidden text-right sm:block">
            <p class="tnum text-foreground text-sm">
                {{ formatCrypto(balance.balance) }} {{ chain.symbol }}
            </p>
            <p
                class="tnum text-xs"
                :class="
                    balance.change24hPct >= 0
                        ? 'text-vault-mint'
                        : 'text-vault-rose'
                "
            >
                {{ formatPct(balance.change24hPct) }}
            </p>
        </div>

        <div class="text-right">
            <p class="tnum text-foreground text-sm font-semibold">
                {{ formatUsd(balance.usdValue) }}
            </p>
            <p class="tnum text-vault-ink-dim text-xs sm:hidden">
                {{ formatCrypto(balance.balance) }} {{ chain.symbol }}
            </p>
            <div class="mt-0.5 flex items-center justify-end gap-1">
                <span
                    class="tnum text-xs"
                    :class="[priceColor, flashClass]"
                >
                    {{ priceDisplay }}
                    <span :class="changeColor">(24h {{ priceChangeDisplay }})</span>
                </span>
            </div>
        </div>
    </Link>
</template>
