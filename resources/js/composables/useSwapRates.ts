import { computed } from 'vue';
import { useCoinGecko } from './useCoinGecko';
import { MOCK_BALANCES } from '@/lib/data';
import type { ChainId } from '@/types/wallet';

// Pairs that can be swapped (token -> token, same nominal network family)
// For a demo we allow any token->token swap using USD mid-rates.
const ALL_CHAINS: ChainId[] = ['btc', 'eth', 'bsc', 'trx', 'sol', 'ltc', 'usdt-erc', 'usdt-trc', 'usdt-bsc', 'usdc-eth'];

// Fallback prices (USD) seeded from the portfolio's recorded prices so swap
// rates and estimates still work when the live price APIs are unreachable.
const FALLBACK_PRICES: Record<ChainId, number> = (() => {
    const map = {} as Record<ChainId, number>;
    for (const b of MOCK_BALANCES) map[b.chain] = b.priceUsd;
    return map;
})();

export function useSwapRates() {
    const { prices, loading } = useCoinGecko(ALL_CHAINS);

    // Exchange rate from srcChain to dstChain derived from USD prices.
    // rate = (dstPrice / srcPrice) with a small spread baked in.
    const rate = computed(() => (src: ChainId, dst: ChainId) => {
        const srcPrice = prices.value[src]?.usd ?? FALLBACK_PRICES[src];
        const dstPrice = prices.value[dst]?.usd ?? FALLBACK_PRICES[dst];
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

    return { prices, loading, rate, estimate };
}
