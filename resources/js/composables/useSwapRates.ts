import { computed, onMounted, onUnmounted } from 'vue';
import { useCoinGecko } from './useCoinGecko';
import type { ChainId } from '@/types/wallet';

// Pairs that can be swapped (token -> token, same nominal network family)
// For a demo we allow any token->token swap using USD mid-rates.
const ALL_CHAINS: ChainId[] = ['btc', 'eth', 'bsc', 'trx', 'sol', 'ltc', 'usdt-erc', 'usdt-trc', 'usdt-bsc', 'usdc-eth'];

export function useSwapRates() {
    const { prices, loading } = useCoinGecko(ALL_CHAINS);

    // Exchange rate from srcChain to dstChain derived from USD prices.
    // rate = (dstPrice / srcPrice) with a small spread baked in.
    const rate = computed(() => (src: ChainId, dst: ChainId) => {
        const srcPrice = prices.value[src]?.usd;
        const dstPrice = prices.value[dst]?.usd;
        if (!srcPrice || !dstPrice || srcPrice <= 0) return null;
        // 0.5% spread for demo purposes
        const mid = dstPrice / srcPrice;
        const spread = 0.995; // slightly worse than mid
        return mid * spread;
    });

    // Estimated receive amount
    const estimate = computed(() => (src: ChainId, dst: ChainId, amount: number) => {
        const r = rate.value(src, dst);
        if (r == null || amount <= 0) return null;
        return amount * r;
    });

    // Load rates eagerly once on mount
    onMounted(() => {
        // useCoinGecko already triggers the global fetch
    });

    return { prices, loading, rate, estimate };
}
