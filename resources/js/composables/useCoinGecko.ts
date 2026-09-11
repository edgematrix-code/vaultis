import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { ChainId } from '@/types/wallet';

interface CoinGeckoPrice {
    usd: number;
    usd_24h_change: number;
}

// Global singleton - shared across all components
const globalPrices = ref<Record<ChainId, CoinGeckoPrice | null>>({
    btc: null,
    eth: null,
    bsc: null,
    trx: null,
    sol: null,
    ltc: null,
    'usdt-erc': null,
    'usdt-trc': null,
    'usdt-bsc': null,
    'usdc-eth': null,
});

const loading = ref(false);
const error = ref<string | null>(null);

let pollingInterval: ReturnType<typeof setInterval> | null = null;
const POLL_INTERVAL_MS = 60_000;

// Coin identifiers for different APIs
const API_IDS: Record<ChainId, { coingecko: string; cmc: string }> = {
    btc: { coingecko: 'bitcoin', cmc: '1' },
    eth: { coingecko: 'ethereum', cmc: '1027' },
    bsc: { coingecko: 'binancecoin', cmc: '1839' },
    trx: { coingecko: 'tron', cmc: '1958' },
    sol: { coingecko: 'solana', cmc: '4125' },
    ltc: { coingecko: 'litecoin', cmc: '2' },
    'usdt-erc': { coingecko: 'tether', cmc: '825' },
    'usdt-trc': { coingecko: 'tether', cmc: '825' },
    'usdt-bsc': { coingecko: 'tether', cmc: '825' },
    'usdc-eth': { coingecko: 'usd-coin', cmc: '3408' },
};

// CoinCap API IDs
const COINCAP_IDS: Record<ChainId, string> = {
    btc: 'bitcoin',
    eth: 'ethereum',
    bsc: 'binancecoin',
    trx: 'tron',
    sol: 'solana',
    ltc: 'litecoin',
    'usdt-erc': 'tether',
    'usdt-trc': 'tether',
    'usdt-bsc': 'tether',
    'usdc-eth': 'usd-coin',
};

// CoinGecko API
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// CoinCap API
const COINCAP_API = 'https://api.coincap.io/v2';

async function fetchFromCoinCap(chainId: ChainId): Promise<CoinGeckoPrice | null> {
    const id = COINCAP_IDS[chainId];
    const url = `${COINCAP_API}/assets/${id}`;

    try {
        const resp = await fetch(url, {
            headers: { 'Accept': 'application/json' },
        }, { signal: AbortSignal.timeout(5000) });

        if (!resp.ok) return null;

        const data = await resp.json();
        if (data.data && data.data.priceUsd) {
            const priceUsd = parseFloat(data.data.priceUsd);
            const change24h = data.data.changePercent24Hr ? parseFloat(data.data.changePercent24Hr) : 0;
            return {
                usd: priceUsd,
                usd_24h_change: change24h,
            };
        }
    } catch (e) {
        // silently fail
    }
    return null;
}

async function fetchFromCoinGecko(chainId: ChainId): Promise<CoinGeckoPrice | null> {
    const geckoId = API_IDS[chainId].coingecko;
    const url = `${COINGECKO_API}/simple/price?ids=${geckoId}&vs_currencies=usd&include_24hr_change=true`;

    try {
        const resp = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
        }, { signal: AbortSignal.timeout(8000) });

        if (!resp.ok) return null;

        const data = await resp.json();
        const coinData = data[geckoId] as Record<string, number> | undefined;

        if (coinData && coinData.usd != null) {
            return {
                usd: coinData.usd,
                usd_24h_change: coinData.usd_24h_change ?? 0,
            };
        }
    } catch (e) {
        // silently fail
    }
    return null;
}

async function fetchAllPrices(): Promise<void> {
    const allChainIds: ChainId[] = ['btc', 'eth', 'bsc', 'trx', 'sol', 'ltc', 'usdt-erc', 'usdt-trc', 'usdt-bsc', 'usdc-eth'];

    if (typeof fetch !== 'function') {
        console.warn('[Price] fetch API not available');
        return;
    }

    loading.value = true;
    error.value = null;

    try {
        // Fetch all coins in parallel from CoinCap
        const fetchPromises = allChainIds.map(async (chainId) => {
            let priceData = await fetchFromCoinCap(chainId);

            if (!priceData) {
                priceData = await fetchFromCoinGecko(chainId);
            }

            if (priceData) {
                globalPrices.value[chainId] = priceData;
                console.log(`[Price] ✓ ${chainId}: $${priceData.usd}`);
            } else {
                console.warn(`[Price] ✗ All providers failed for ${chainId}`);
            }
        });

        await Promise.all(fetchPromises);

        const updated = Object.values(globalPrices.value).filter(Boolean).length;
        console.log(`[Price] Fetch complete: ${updated}/${allChainIds.length} coins updated`);
    } finally {
        loading.value = false;
    }
}

// Start global polling once (shared across all components)
let hasStarted = false;
function ensurePollingStarted() {
    if (hasStarted) return;
    hasStarted = true;

    // Initial fetch
    fetchAllPrices();

    // Set up polling
    pollingInterval = setInterval(() => {
        fetchAllPrices();
    }, POLL_INTERVAL_MS);
}

function stopPolling() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
    }
}

// Use a counter to track active components
let activeComponents = 0;

export function useCoinGecko(chainIds: ChainId[] = []) {
    // Local computed that reads from global cache
    const localPrices = computed(() => {
        const result: Record<ChainId, CoinGeckoPrice | null> = {} as Record<ChainId, CoinGeckoPrice | null>;
        for (const id of chainIds) {
            result[id] = globalPrices.value[id];
        }
        return result;
    });

    onMounted(() => {
        activeComponents++;
        if (!hasStarted) {
            ensurePollingStarted();
        }
    });

    onUnmounted(() => {
        activeComponents--;
        if (activeComponents <= 0) {
            stopPolling();
            hasStarted = false;
        }
    });

    return {
        prices: localPrices,
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        getPrice: (chainId: ChainId) => globalPrices.value[chainId],
    };
}

export { COINCAP_IDS, COINGECKO_API, COINCAP_API };
