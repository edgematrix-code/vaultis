import type { AssetBalance, Chain, ChainId } from '@/types/wallet';

/**
 * Static chain registry and pure formatting helpers.
 *
 * Dynamic wallet data (balances, prices, transactions, history, security)
 * is served by the Laravel backend through Inertia page props — see the
 * Dashboard / Wallet / Transactions controllers and routes/web.php.
 */

export const CHAINS: Record<ChainId, Chain> = {
    btc: {
        id: 'btc',
        name: 'Bitcoin',
        symbol: 'BTC',
        network: 'Bitcoin',
        color: '#F2A93B',
        decimals: 8,
        logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg',
    },
    eth: {
        id: 'eth',
        name: 'Ethereum',
        symbol: 'ETH',
        network: 'Ethereum',
        color: '#8FA3D9',
        decimals: 6,
        logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
    },
    bsc: {
        id: 'bsc',
        name: 'BNB Smart Chain',
        symbol: 'BNB',
        network: 'BNB Smart Chain',
        color: '#E7B65C',
        decimals: 6,
        logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg',
    },
    trx: {
        id: 'trx',
        name: 'TRON',
        symbol: 'TRX',
        network: 'TRON',
        color: '#E2564F',
        decimals: 4,
        logo: 'https://cryptologos.cc/logos/tron-trx-logo.svg',
    },
    usdt: {
        id: 'usdt',
        name: 'Tether USD',
        symbol: 'USDT',
        network: 'Ethereum',
        color: '#3FBF8F',
        decimals: 2,
        logo: 'https://cryptologos.cc/logos/tether-usdt-logo.svg',
    },
    usdc: {
        id: 'usdc',
        name: 'USD Coin',
        symbol: 'USDC',
        network: 'Ethereum',
        color: '#4C8DD9',
        decimals: 2,
        logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg',
    },
};

export const CHAIN_LIST: Chain[] = Object.values(CHAINS);

/**
 * Multi-network address map for tokens that exist on multiple networks.
 * Keyed by token chain ID, then by network chain ID.
 */
export const TOKEN_NETWORKS: Record<ChainId, ChainId[]> = {
    btc: ['btc'],
    eth: ['eth'],
    bsc: ['bsc'],
    trx: ['trx'],
    usdt: ['eth', 'bsc', 'trx'],
    usdc: ['eth', 'bsc', 'trx'],
};

/** Mock addresses per token + network for demo purposes */
export const TOKEN_ADDRESSES: Record<ChainId, Record<ChainId, string>> = {
    btc: { btc: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
    eth: { eth: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18' },
    bsc: { bsc: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18' },
    trx: { trx: 'TWzQk2JCk2pZM4N8MoY5rKzL3xV9jY7nBv' },
    usdt: {
        eth: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
        bsc: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
        trx: 'TNwaU7D5QD8g7J8kRjK3xK1vL9mY5nBvZ3',
    },
    usdc: {
        eth: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
        bsc: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
        trx: 'TUyqR8K2pLxV9mNjK4xL7vB3nJ9dF6gH2w',
    },
};

/**
 * Returns the list of networks a token is available on.
 */
export function getTokenNetworks(token: ChainId): Chain[] {
    return TOKEN_NETWORKS[token]
        .map((netId) => CHAINS[netId])
        .filter(Boolean);
}

/**
 * Returns the deposit/receive address for a given token on a specific network.
 */
export function getTokenAddress(token: ChainId, network: ChainId): string {
    return TOKEN_ADDRESSES[token]?.[network] ?? '';
}

export function getPortfolioTotal(balances: Pick<AssetBalance, 'usdValue'>[]) {
    return balances.reduce((sum, b) => sum + b.usdValue, 0);
}

export function getPortfolioChangePct(
    balances: Pick<AssetBalance, 'change24hPct' | 'usdValue'>[],
    total: number,
) {
    const weighted = balances.reduce(
        (sum, b) => sum + b.change24hPct * b.usdValue,
        0,
    );
    return total > 0 ? weighted / total : 0;
}

const EXPLORERS: Record<ChainId, string> = {
    btc: 'https://mempool.space/tx/',
    eth: 'https://etherscan.io/tx/',
    bsc: 'https://bscscan.com/tx/',
    trx: 'https://tronscan.org/#/transaction/',
    usdt: 'https://etherscan.io/tx/',
    usdc: 'https://etherscan.io/tx/',
};

export function explorerUrl(chain: ChainId, txHash: string) {
    return `${EXPLORERS[chain]}${txHash}`;
}

export function formatUsd(value: number, opts: Intl.NumberFormatOptions = {}) {
    // Charts may request 0 decimals (e.g. whole-dollar portfolio totals); the
    // minimum must never exceed the maximum or Intl.NumberFormat throws.
    const maximumFractionDigits = opts.maximumFractionDigits ?? 2;

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: Math.min(2, maximumFractionDigits),
        maximumFractionDigits,
        ...opts,
    }).format(value);
}

export function formatCrypto(value: number, decimals = 4) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
    }).format(value);
}

export function formatUsdPrice(price: number): string {
    if (price < 0.01) {
        return '$' + price.toFixed(6);
    }
    if (price < 1) {
        return '$' + price.toFixed(4);
    }
    if (price < 100) {
        return '$' + price.toFixed(2);
    }
    return '$' + price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function formatPct(value: number) {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
}

export function truncateAddress(address: string, lead = 6, tail = 6) {
    if (address.length <= lead + tail + 3) return address;
    return `${address.slice(0, lead)}…${address.slice(-tail)}`;
}

export function formatRelativeTime(iso: string) {
    const date = new Date(iso);
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.round(diffMs / 60_000);
    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.round(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.round(diffHr / 24);
    if (diffDay < 30) return `${diffDay}d ago`;
    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
