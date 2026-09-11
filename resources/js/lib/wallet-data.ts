import type { AssetBalance, Chain, ChainId } from '@/types/wallet';

/** Static chain registry and pure formatting helpers. */

function logoFor(id: ChainId): string {
    const brandCandidates: Record<ChainId, string[]> = {
        btc: ['/brand/coins/btc.png'],
        eth: ['/brand/coins/eth.png'],
        bsc: ['/brand/coins/bnb.png'],
        trx: ['/brand/coins/trx.png'],
        sol: ['/brand/coins/solana.png'],
        ltc: ['/brand/coins/ltc.png'],
        'usdt-erc': ['/brand/coins/usdt.png'],
        'usdt-trc': ['/brand/coins/usdt.png'],
        'usdt-bsc': ['/brand/coins/usdt.png'],
        'usdc-eth': ['/brand/coins/usdc.png'],
    };

    const brand = brandCandidates[id];
    if (brand) {
        for (const path of brand) {
            if (path) return path;
        }
    }

    return '';
}

export const CHAINS: Record<ChainId, Chain> = {
    btc: {
        id: 'btc',
        name: 'Bitcoin',
        symbol: 'BTC',
        network: 'Bitcoin',
        color: '#F2A93B',
        decimals: 8,
        logo: logoFor('btc'),
    },
    eth: {
        id: 'eth',
        name: 'Ethereum',
        symbol: 'ETH',
        network: 'Ethereum',
        color: '#8FA3D9',
        decimals: 6,
        logo: logoFor('eth'),
    },
    bsc: {
        id: 'bsc',
        name: 'BNB Smart Chain',
        symbol: 'BNB',
        network: 'BNB Smart Chain',
        color: '#E7B65C',
        decimals: 6,
        logo: logoFor('bsc'),
    },
    trx: {
        id: 'trx',
        name: 'TRON',
        symbol: 'TRX',
        network: 'TRON',
        color: '#E2564F',
        decimals: 4,
        logo: logoFor('trx'),
    },
    sol: {
        id: 'sol',
        name: 'Solana',
        symbol: 'SOL',
        network: 'Solana',
        color: '#14F195',
        decimals: 9,
        logo: logoFor('sol'),
    },
    ltc: {
        id: 'ltc',
        name: 'Litecoin',
        symbol: 'LTC',
        network: 'Litecoin',
        color: '#A6A9AA',
        decimals: 8,
        logo: logoFor('ltc'),
    },
    'usdt-erc': {
        id: 'usdt-erc',
        name: 'Tether USD',
        symbol: 'USDT',
        network: 'Ethereum',
        color: '#3FBF8F',
        decimals: 2,
        logo: logoFor('usdt-erc'),
    },
    'usdt-trc': {
        id: 'usdt-trc',
        name: 'Tether USD',
        symbol: 'USDT',
        network: 'TRON',
        color: '#3FBF8F',
        decimals: 2,
        logo: logoFor('usdt-trc'),
    },
    'usdt-bsc': {
        id: 'usdt-bsc',
        name: 'Tether USD',
        symbol: 'USDT',
        network: 'BNB Smart Chain',
        color: '#3FBF8F',
        decimals: 2,
        logo: logoFor('usdt-bsc'),
    },
    'usdc-eth': {
        id: 'usdc-eth',
        name: 'USDC Coin',
        symbol: 'USDC',
        network: 'Ethereum',
        color: '#4C8DD9',
        decimals: 2,
        logo: logoFor('usdc-eth'),
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
    sol: ['sol'],
    ltc: ['ltc'],
    'usdt-erc': ['usdt-erc'],
    'usdt-trc': ['usdt-trc'],
    'usdt-bsc': ['usdt-bsc'],
    'usdc-eth': ['usdc-eth'],
};

/** Deposit/receive addresses per token + network */
export const TOKEN_ADDRESSES: Record<ChainId, Record<ChainId, string>> = {
    btc: { btc: 'bc1qys0x2xvd39auaakxh9q7ek64skn6ftfyzsplga' },
    eth: { eth: '0xaB270D8d31C2fBE1fE0B5D2E9A974c44AA821c10' },
    bsc: { bsc: '0xaB270D8d31C2fBE1fE0B5D2E9A974c44AA821c10' },
    trx: { trx: 'TH7yVRLDtWoBkemNupVKusgNCEzHccnqP7' },
    sol: { sol: 'HT4rMEuCvdaJe5VVcbQ71Wfd7txEH3sTHMXztjQDchZf' },
    ltc: { ltc: 'ltc1qsrkqq35g3yhkw3py38fcr6ez387kukw49m6rw0' },
    'usdt-erc': { 'usdt-erc': '0xaB270D8d31C2fBE1fE0B5D2E9A974c44AA821c10' },
    'usdt-trc': { 'usdt-trc': 'TH7yVRLDtWoBkemNupVKusgNCEzHccnqP7' },
    'usdt-bsc': { 'usdt-bsc': '0xaB270D8d31C2fBE1fE0B5D2E9A974c44AA821c10' },
    'usdc-eth': { 'usdc-eth': '0xaB270D8d31C2fBE1fE0B5D2E9A974c44AA821c10' },
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
    sol: 'https://solscan.io/tx/',
    ltc: 'https://blockchair.com/litecoin/transaction/',
    'usdt-erc': 'https://etherscan.io/tx/',
    'usdt-trc': 'https://tronscan.org/#/transaction/',
    'usdt-bsc': 'https://bscscan.com/tx/',
    'usdc-eth': 'https://etherscan.io/tx/',
};

export function explorerUrl(chain: ChainId, txHash: string) {
    return `${EXPLORERS[chain]}${txHash}`;
}

export function formatUsd(value: number, opts: Intl.NumberFormatOptions = {}) {
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
