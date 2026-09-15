export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
};

export type Auth = {
    user: User | null;
};

export type ChainId = 'btc' | 'eth' | 'bsc' | 'trx' | 'sol' | 'ltc' | 'usdt-erc' | 'usdt-trc' | 'usdt-bsc' | 'usdc-eth';

export type Chain = {
    id: ChainId;
    name: string;
    symbol: string;
    network: string;
    color: string;
    decimals: number;
};

export type AssetBalance = {
    chain: ChainId;
    address: string;
    balance: number;
    usdValue: number;
    priceUsd: number;
    change24hPct: number;
};

export type TransactionStatus = 'completed' | 'pending' | 'failed';
export type TransactionType = 'deposit' | 'withdrawal' | 'internal';

export type Transaction = {
    id: string;
    chain: ChainId;
    type: TransactionType;
    status: TransactionStatus;
    amount: number;
    usdValue: number;
    fee: number;
    txHash: string;
    fromAddress: string;
    toAddress: string;
    createdAt: string;
    confirmedAt: string | null;
    note?: string;
};

export type PortfolioPoint = {
    label: string;
    value: number;
};

export type SecurityStatus = {
    twoFactorEnabled: boolean;
    lastLogin: string;
    lastLoginDevice: string;
    nonCustodial: true;
};

export type FlashToast = {
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
};

export type Preference = {
    event: string;
    email: boolean;
    inApp: boolean;
};

export const MOCK_AUTH: Auth = {
    user: {
        id: 1,
        name: 'Beverly Myles',
        email: 'beverlymyles730@gmail.com',
        avatar: '/BeverlyMyles.png',
        email_verified_at: '2024-01-15T10:00:00Z',
        two_factor_enabled: true,
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-09-01T10:00:00Z',
    },
};

export const MOCK_BALANCES: AssetBalance[] = [
    // Bitcoin
    {
        chain: 'btc',
        address: 'bc1qys0x2xvd39auaakxh9q7ek64skn6ftfyzsplga',
        balance: 5.0472911,
        usdValue: 344325.0,
        priceUsd: 68213.0,
        change24hPct: 1.23,
    },
    // Ethereum
    {
        chain: 'eth',
        address: '0xaB270D8d31C2fBE1fE0B5D2E9A974c44AA821c10',
        balance: 54.3415,
        usdValue: 149269.18,
        priceUsd: 2746.5,
        change24hPct: -0.87,
    },
    // BNB Smart Chain
    {
        chain: 'bsc',
        address: '0xaB270D8d31C2fBE1fE0B5D2E9A974c44AA821c10',
        balance: 370,
        usdValue: 108595.0,
        priceUsd: 293.5,
        change24hPct: 2.14,
    },
    // TRON
    {
        chain: 'trx',
        address: 'TH7yVRLDtWoBkemNupVKusgNCEzHccnqP7',
        balance: 415000,
        usdValue: 39508.0,
        priceUsd: 0.0952,
        change24hPct: 0.56,
    },
    // Solana
    {
        chain: 'sol',
        address: 'HT4rMEuCvdaJe5VVcbQ71Wfd7txEH3sTHMXztjQDchZf',
        balance: 235,
        usdValue: 23500.0,
        priceUsd: 100.0,
        change24hPct: 3.42,
    },
    // Litecoin
    {
        chain: 'ltc',
        address: 'ltc1qsrkqq35g3yhkw3py38fcr6ez387kukw49m6rw0',
        balance: 7200,
        usdValue: 45360.0,
        priceUsd: 6.3,
        change24hPct: -1.12,
    },
    // USDT on Ethereum (~24% of portfolio)
    {
        chain: 'usdt-erc',
        address: '0xaB270D8d31C2fBE1fE0B5D2E9A974c44AA821c10',
        balance: 482500,
        usdValue: 482500.0,
        priceUsd: 1.0,
        change24hPct: 0.01,
    },
    // USDT on TRON (TRC20) (~14% of portfolio)
    {
        chain: 'usdt-trc',
        address: 'TH7yVRLDtWoBkemNupVKusgNCEzHccnqP7',
        balance: 294500,
        usdValue: 294500.0,
        priceUsd: 1.0,
        change24hPct: 0.02,
    },
    // USDT on BNB Smart Chain (BEP20) (~10% of portfolio)
    {
        chain: 'usdt-bsc',
        address: '0xaB270D8d31C2fBE1fE0B5D2E9A974c44AA821c10',
        balance: 217572,
        usdValue: 217572.0,
        priceUsd: 1.0,
        change24hPct: 0.01,
    },
    // USDC on Ethereum (~5% of portfolio)
    {
        chain: 'usdc-eth',
        address: '0xaB270D8d31C2fBE1fE0B5D2E9A974c44AA821c10',
        balance: 129634,
        usdValue: 129634.0,
        priceUsd: 1.0,
        change24hPct: -0.03,
    },
];

const WALLET_BTC = 'bc1qys0x2xvd39auaakxh9q7ek64skn6ftfyzsplga';
const WALLET_EVM = '0xaB270D8d31C2fBE1fE0B5D2E9A974c44AA821c10';
const WALLET_TRON = 'TH7yVRLDtWoBkemNupVKusgNCEzHccnqP7';
const WALLET_SOL = 'HT4rMEuCvdaJe5VVcbQ71Wfd7txEH3sTHMXztjQDchZf';
const WALLET_LTC = 'ltc1qsrkqq35g3yhkw3py38fcr6ez387kukw49m6rw0';

const EXT_BTC = 'bc1qxw9v2n0vskq9wjm8f4c3t7y2hd5ls9p3xk4r2e';
const EXT_EVM = '0x8fA24c6B19E0a3D77B41c5e9f2B08d6a34C71E9b';
const EXT_TRON = 'TXk9rQ2mL5vB7nJ3cF8sD1pW6yH4gZ0aNe';
const EXT_SOL = '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin';
const EXT_LTC = 'ltc1q7j3k9m2v8x4w6y1z5a0b9c8d7e6f5g4h3j2k9l';

/**
 * Reconciled mock ledger: for every chain, completed deposits minus
 * completed withdrawals equal the current MOCK_BALANCES balance exactly,
 * so the transaction history genuinely explains the portfolio total.
 *
 * The account was funded Jan–Aug 2024 (rounds 1–3), scaled up by a
 * fourth funding round Oct 2024–Aug 2025 (TXN-032…041); the most recent
 * completed withdrawal is dated exactly 2 years ago (see TXN-030).
 */
export const MOCK_TRANSACTIONS: Transaction[] = [
    // ── Funding round 1 (Jan–Feb 2024) ─────────────────────────────
    {
        id: 'TXN-001',
        chain: 'usdt-erc',
        type: 'deposit',
        status: 'completed',
        amount: 120000,
        usdValue: 120000.0,
        fee: 3.2,
        txHash: '0x9f2c41d8a7b3e6501c84f2d09b5a7e3168c0d4f9a2b7e5c1836094d7f2aeb5c1',
        fromAddress: EXT_EVM,
        toAddress: WALLET_EVM,
        createdAt: '2024-01-15T10:04:00Z',
        confirmedAt: '2024-01-15T10:11:00Z',
        note: 'Initial funding',
    },
    {
        id: 'TXN-002',
        chain: 'eth',
        type: 'deposit',
        status: 'completed',
        amount: 10,
        usdValue: 27465.0,
        fee: 4.1,
        txHash: '0x3b7e9a12c5d8046f8a21b9c7d3e5f0a648b2c9d1e7f3a5b8609c2d4e6f8a1b3c',
        fromAddress: EXT_EVM,
        toAddress: WALLET_EVM,
        createdAt: '2024-01-21T14:32:00Z',
        confirmedAt: '2024-01-21T14:40:00Z',
    },
    {
        id: 'TXN-003',
        chain: 'usdc-eth',
        type: 'deposit',
        status: 'completed',
        amount: 30000,
        usdValue: 30000.0,
        fee: 2.9,
        txHash: '0x7d41c9e2f8a6b305d1c74f9e3a2b8d6c0591e4f7a3b2c8d6e9f1a4b7c2d8e5f0',
        fromAddress: EXT_EVM,
        toAddress: WALLET_EVM,
        createdAt: '2024-02-08T09:18:00Z',
        confirmedAt: '2024-02-08T09:26:00Z',
    },
    {
        id: 'TXN-004',
        chain: 'btc',
        type: 'deposit',
        status: 'completed',
        amount: 2.1,
        usdValue: 143247.3,
        fee: 3.8,
        txHash: '4a5e1e4baab8926ab1800965d70d5412fc2f5e0b1b1c3f7e8a9b0c1d2e3f4a5b',
        fromAddress: EXT_BTC,
        toAddress: WALLET_BTC,
        createdAt: '2024-02-10T17:45:00Z',
        confirmedAt: '2024-02-10T18:20:00Z',
    },
    {
        id: 'TXN-005',
        chain: 'ltc',
        type: 'deposit',
        status: 'completed',
        amount: 2500,
        usdValue: 15750.0,
        fee: 0.12,
        txHash: 'b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2',
        fromAddress: EXT_LTC,
        toAddress: WALLET_LTC,
        createdAt: '2024-02-25T11:02:00Z',
        confirmedAt: '2024-02-25T11:09:00Z',
    },
    // ── Funding round 2 (Mar–Jun 2024) ─────────────────────────────
    {
        id: 'TXN-006',
        chain: 'bsc',
        type: 'deposit',
        status: 'completed',
        amount: 120,
        usdValue: 35220.0,
        fee: 0.35,
        txHash: '0x5e8f2a1b9c3d7e4f6a0b8c2d9e1f3a5b7c9d0e2f4a6b8c0d2e4f6a8b0c2d4e6',
        fromAddress: EXT_EVM,
        toAddress: WALLET_EVM,
        createdAt: '2024-03-02T13:27:00Z',
        confirmedAt: '2024-03-02T13:33:00Z',
    },
    {
        id: 'TXN-007',
        chain: 'usdt-trc',
        type: 'deposit',
        status: 'completed',
        amount: 90000,
        usdValue: 90000.0,
        fee: 1.0,
        txHash: '6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d',
        fromAddress: EXT_TRON,
        toAddress: WALLET_TRON,
        createdAt: '2024-03-18T16:54:00Z',
        confirmedAt: '2024-03-18T16:59:00Z',
    },
    {
        id: 'TXN-008',
        chain: 'usdt-bsc',
        type: 'deposit',
        status: 'completed',
        amount: 80000,
        usdValue: 80000.0,
        fee: 0.27,
        txHash: '0x2d9e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2',
        fromAddress: EXT_EVM,
        toAddress: WALLET_EVM,
        createdAt: '2024-04-05T08:41:00Z',
        confirmedAt: '2024-04-05T08:47:00Z',
    },
    {
        id: 'TXN-009',
        chain: 'trx',
        type: 'deposit',
        status: 'completed',
        amount: 150000,
        usdValue: 14280.0,
        fee: 0.8,
        txHash: '004a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a',
        fromAddress: EXT_TRON,
        toAddress: WALLET_TRON,
        createdAt: '2024-04-11T19:03:00Z',
        confirmedAt: '2024-04-11T19:09:00Z',
    },
    {
        id: 'TXN-010',
        chain: 'eth',
        type: 'deposit',
        status: 'completed',
        amount: 6.5,
        usdValue: 17852.25,
        fee: 3.7,
        txHash: '0x8c1e3a5b7d9f0b2d4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8e0',
        fromAddress: EXT_EVM,
        toAddress: WALLET_EVM,
        createdAt: '2024-05-03T12:16:00Z',
        confirmedAt: '2024-05-03T12:24:00Z',
    },
    {
        id: 'TXN-011',
        chain: 'sol',
        type: 'deposit',
        status: 'completed',
        amount: 60,
        usdValue: 6000.0,
        fee: 0.01,
        txHash: '3Kz9wPq2vXnR7tYc4mLb8JdFs6HuEa1Qz5VoTrN9WxGk2pDy',
        fromAddress: EXT_SOL,
        toAddress: WALLET_SOL,
        createdAt: '2024-06-01T10:37:00Z',
        confirmedAt: '2024-06-01T10:39:00Z',
    },
    {
        id: 'TXN-012',
        chain: 'btc',
        type: 'deposit',
        status: 'completed',
        amount: 1.25,
        usdValue: 85266.25,
        fee: 2.9,
        txHash: 'f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5',
        fromAddress: EXT_BTC,
        toAddress: WALLET_BTC,
        createdAt: '2024-06-14T15:58:00Z',
        confirmedAt: '2024-06-14T16:36:00Z',
    },
    {
        id: 'TXN-013',
        chain: 'usdt-erc',
        type: 'deposit',
        status: 'completed',
        amount: 100000,
        usdValue: 100000.0,
        fee: 3.5,
        txHash: '0x1a3c5e7f9b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d1f3',
        fromAddress: EXT_EVM,
        toAddress: WALLET_EVM,
        createdAt: '2024-06-20T09:12:00Z',
        confirmedAt: '2024-06-20T09:20:00Z',
    },
    // ── Funding round 3 (Jul–Aug 2024) ─────────────────────────────
    {
        id: 'TXN-014',
        chain: 'ltc',
        type: 'deposit',
        status: 'completed',
        amount: 2600,
        usdValue: 16380.0,
        fee: 0.15,
        txHash: 'c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3',
        fromAddress: EXT_LTC,
        toAddress: WALLET_LTC,
        createdAt: '2024-07-07T14:49:00Z',
        confirmedAt: '2024-07-07T14:56:00Z',
    },
    {
        id: 'TXN-015',
        chain: 'bsc',
        type: 'deposit',
        status: 'completed',
        amount: 90,
        usdValue: 26415.0,
        fee: 0.3,
        txHash: '0x6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8',
        fromAddress: EXT_EVM,
        toAddress: WALLET_EVM,
        createdAt: '2024-07-19T17:23:00Z',
        confirmedAt: '2024-07-19T17:29:00Z',
    },
    {
        id: 'TXN-016',
        chain: 'usdt-bsc',
        type: 'deposit',
        status: 'completed',
        amount: 45000,
        usdValue: 45000.0,
        fee: 0.25,
        txHash: '0x9b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b1',
        fromAddress: EXT_EVM,
        toAddress: WALLET_EVM,
        createdAt: '2024-07-28T11:38:00Z',
        confirmedAt: '2024-07-28T11:44:00Z',
    },
    {
        id: 'TXN-017',
        chain: 'trx',
        type: 'deposit',
        status: 'completed',
        amount: 200000,
        usdValue: 19040.0,
        fee: 0.9,
        txHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
        fromAddress: EXT_TRON,
        toAddress: WALLET_TRON,
        createdAt: '2024-08-05T13:05:00Z',
        confirmedAt: '2024-08-05T13:11:00Z',
    },
    {
        id: 'TXN-018',
        chain: 'usdt-trc',
        type: 'deposit',
        status: 'completed',
        amount: 60000,
        usdValue: 60000.0,
        fee: 1.2,
        txHash: '7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
        fromAddress: EXT_TRON,
        toAddress: WALLET_TRON,
        createdAt: '2024-08-10T10:26:00Z',
        confirmedAt: '2024-08-10T10:31:00Z',
    },
    {
        id: 'TXN-019',
        chain: 'usdc-eth',
        type: 'deposit',
        status: 'completed',
        amount: 25000,
        usdValue: 25000.0,
        fee: 2.6,
        txHash: '0x4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4f7',
        fromAddress: EXT_EVM,
        toAddress: WALLET_EVM,
        createdAt: '2024-08-12T18:14:00Z',
        confirmedAt: '2024-08-12T18:22:00Z',
    },
    {
        id: 'TXN-020',
        chain: 'sol',
        type: 'deposit',
        status: 'completed',
        amount: 45,
        usdValue: 4500.0,
        fee: 0.01,
        txHash: '8XwQeR4tYu1oIpAs6DfGh2JkLz9CxVb3Nm5QwErTy0uIo1pA',
        fromAddress: EXT_SOL,
        toAddress: WALLET_SOL,
        createdAt: '2024-08-22T09:47:00Z',
        confirmedAt: '2024-08-22T09:49:00Z',
    },
    // ── Withdrawals (Aug–Sep 2024, latest = 2 years ago) ───────────
    {
        id: 'TXN-021',
        chain: 'ltc',
        type: 'withdrawal',
        status: 'completed',
        amount: 900,
        usdValue: 5670.0,
        fee: 0.18,
        txHash: 'd3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4',
        fromAddress: WALLET_LTC,
        toAddress: EXT_LTC,
        createdAt: '2024-08-15T12:33:00Z',
        confirmedAt: '2024-08-15T12:41:00Z',
    },
    {
        id: 'TXN-022',
        chain: 'usdt-trc',
        type: 'withdrawal',
        status: 'completed',
        amount: 15500,
        usdValue: 15500.0,
        fee: 1.1,
        txHash: '8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
        fromAddress: WALLET_TRON,
        toAddress: EXT_TRON,
        createdAt: '2024-08-18T15:07:00Z',
        confirmedAt: '2024-08-18T15:12:00Z',
    },
    {
        id: 'TXN-023',
        chain: 'usdc-eth',
        type: 'withdrawal',
        status: 'completed',
        amount: 2200,
        usdValue: 2200.0,
        fee: 3.0,
        txHash: '0x2b4d6f8a0c2e4a6c8e0a2c4e6a8c0e2a4c6e8a0c2e4a6c8e0a2c4e6a8c0e2b4',
        fromAddress: WALLET_EVM,
        toAddress: EXT_EVM,
        createdAt: '2024-08-25T16:52:00Z',
        confirmedAt: '2024-08-25T17:00:00Z',
    },
    {
        id: 'TXN-024',
        chain: 'btc',
        type: 'withdrawal',
        status: 'completed',
        amount: 0.3027089,
        usdValue: 20648.68,
        fee: 3.3,
        txHash: '0x1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
        fromAddress: WALLET_BTC,
        toAddress: EXT_BTC,
        createdAt: '2024-08-28T14:30:00Z',
        confirmedAt: '2024-08-28T15:05:00Z',
    },
    {
        id: 'TXN-025',
        chain: 'eth',
        type: 'withdrawal',
        status: 'completed',
        amount: 2.1585,
        usdValue: 5928.32,
        fee: 5.1,
        txHash: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8',
        fromAddress: WALLET_EVM,
        toAddress: EXT_EVM,
        createdAt: '2024-08-30T11:19:00Z',
        confirmedAt: '2024-08-30T11:28:00Z',
    },
    {
        id: 'TXN-026',
        chain: 'trx',
        type: 'withdrawal',
        status: 'completed',
        amount: 85000,
        usdValue: 8092.0,
        fee: 1.1,
        txHash: '9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1',
        fromAddress: WALLET_TRON,
        toAddress: EXT_TRON,
        createdAt: '2024-09-02T10:44:00Z',
        confirmedAt: '2024-09-02T10:50:00Z',
    },
    {
        id: 'TXN-027',
        chain: 'usdt-bsc',
        type: 'withdrawal',
        status: 'completed',
        amount: 17428,
        usdValue: 17428.0,
        fee: 0.31,
        txHash: '0x3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b1d3f5a7c9e1b3d5',
        fromAddress: WALLET_EVM,
        toAddress: EXT_EVM,
        createdAt: '2024-09-06T13:29:00Z',
        confirmedAt: '2024-09-06T13:36:00Z',
    },
    {
        id: 'TXN-028',
        chain: 'sol',
        type: 'withdrawal',
        status: 'completed',
        amount: 20,
        usdValue: 2000.0,
        fee: 0.02,
        txHash: '5Qf2vXnR7tYc4mLb8JdFs6HuEa1Qz5VoTrN9WxGk2pDy3Kz9wPq2',
        fromAddress: WALLET_SOL,
        toAddress: EXT_SOL,
        createdAt: '2024-09-09T17:36:00Z',
        confirmedAt: '2024-09-09T17:38:00Z',
    },
    {
        id: 'TXN-029',
        chain: 'bsc',
        type: 'withdrawal',
        status: 'completed',
        amount: 40,
        usdValue: 11740.0,
        fee: 0.41,
        txHash: '0xa0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b',
        fromAddress: WALLET_EVM,
        toAddress: EXT_EVM,
        createdAt: '2024-09-12T09:53:00Z',
        confirmedAt: '2024-09-12T09:59:00Z',
    },
    {
        id: 'TXN-030',
        chain: 'usdt-erc',
        type: 'withdrawal',
        status: 'completed',
        amount: 37500,
        usdValue: 37500.0,
        fee: 4.2,
        txHash: '0xd4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6',
        fromAddress: WALLET_EVM,
        toAddress: EXT_EVM,
        createdAt: '2024-09-13T14:02:00Z',
        confirmedAt: '2024-09-13T14:10:00Z',
        note: 'External transfer',
    },
    // ── Funding round 4 (Oct 2024–Aug 2025) — scales the portfolio to $1,834,763.18
    {
        id: 'TXN-032',
        chain: 'usdt-erc',
        type: 'deposit',
        status: 'completed',
        amount: 300000,
        usdValue: 300000.0,
        fee: 4.1,
        txHash: '0x7c3f8d2b6a9e1c4f7b0d3a6e9c2f5b8d1a4e7c0f3b6d9a2e5c8f1b4d7a0e3c6f',
        fromAddress: EXT_EVM,
        toAddress: WALLET_EVM,
        createdAt: '2024-11-02T11:20:00Z',
        confirmedAt: '2024-11-02T11:28:00Z',
        note: 'Portfolio expansion round',
    },
    {
        id: 'TXN-033',
        chain: 'usdt-trc',
        type: 'deposit',
        status: 'completed',
        amount: 160000,
        usdValue: 160000.0,
        fee: 1.3,
        txHash: '8b4d0c7a9e1f3b5d7c9a0e2f4b6d8c0a2e4f6b8d0c2a4e6f8b0d2c4a6e8f0b2d',
        fromAddress: EXT_TRON,
        toAddress: WALLET_TRON,
        createdAt: '2024-12-14T16:41:00Z',
        confirmedAt: '2024-12-14T16:46:00Z',
    },
    {
        id: 'TXN-034',
        chain: 'usdt-bsc',
        type: 'deposit',
        status: 'completed',
        amount: 110000,
        usdValue: 110000.0,
        fee: 0.29,
        txHash: '0x4e2a9d7c1b5f3e8a0c6d2b8f4a0e6c2d8b4f0a6e2c8d4b0f6a2e8c4d0b6f2a8',
        fromAddress: EXT_EVM,
        toAddress: WALLET_EVM,
        createdAt: '2025-01-20T10:15:00Z',
        confirmedAt: '2025-01-20T10:22:00Z',
    },
    {
        id: 'TXN-035',
        chain: 'usdc-eth',
        type: 'deposit',
        status: 'completed',
        amount: 76834,
        usdValue: 76834.0,
        fee: 2.8,
        txHash: '0x9a5c1e7b3d8f0a4c6e2b8d0f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a4',
        fromAddress: EXT_EVM,
        toAddress: WALLET_EVM,
        createdAt: '2025-02-11T14:52:00Z',
        confirmedAt: '2025-02-11T15:00:00Z',
    },
    {
        id: 'TXN-036',
        chain: 'btc',
        type: 'deposit',
        status: 'completed',
        amount: 2.0,
        usdValue: 136480.38,
        fee: 3.4,
        txHash: '7e3b1a9d5f2c8e0b4d6a8c0e2f4b6d8a0c2e4f6b8d0a2c4e6f8b0d2a4c6e8f0b',
        fromAddress: EXT_BTC,
        toAddress: WALLET_BTC,
        createdAt: '2025-03-06T09:37:00Z',
        confirmedAt: '2025-03-06T10:14:00Z',
    },
    {
        id: 'TXN-037',
        chain: 'eth',
        type: 'deposit',
        status: 'completed',
        amount: 40,
        usdValue: 109860.0,
        fee: 4.6,
        txHash: '0x2f6b0d4a8c2e6f0b4a8d2c0e6f4b8a2d0c6e4f8b2a0d4c6e8f0b2a4d6c8e0f4',
        fromAddress: EXT_EVM,
        toAddress: WALLET_EVM,
        createdAt: '2025-04-17T13:08:00Z',
        confirmedAt: '2025-04-17T13:17:00Z',
    },
    {
        id: 'TXN-038',
        chain: 'bsc',
        type: 'deposit',
        status: 'completed',
        amount: 200,
        usdValue: 58700.0,
        fee: 0.38,
        txHash: '0x8d4a0e2c6f8b0d4a2e6c0f8b4a2d6e0c8f4b2a6d0e8c4f2a6b0d8e4c2f0a6b',
        fromAddress: EXT_EVM,
        toAddress: WALLET_EVM,
        createdAt: '2025-05-23T15:44:00Z',
        confirmedAt: '2025-05-23T15:50:00Z',
    },
    {
        id: 'TXN-039',
        chain: 'trx',
        type: 'deposit',
        status: 'completed',
        amount: 150000,
        usdValue: 14280.0,
        fee: 0.85,
        txHash: '3d8f0b4a6c2e8f0b4d6a0c2e8f4b6d0a2c4e8f6b0d2a4c6e8f0b2d4a6c0e8f2b',
        fromAddress: EXT_TRON,
        toAddress: WALLET_TRON,
        createdAt: '2025-06-09T12:31:00Z',
        confirmedAt: '2025-06-09T12:37:00Z',
    },
    {
        id: 'TXN-040',
        chain: 'sol',
        type: 'deposit',
        status: 'completed',
        amount: 150,
        usdValue: 15000.0,
        fee: 0.02,
        txHash: '6yH4gZ0aNe9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin3Kz9wPq2vXn',
        fromAddress: EXT_SOL,
        toAddress: WALLET_SOL,
        createdAt: '2025-07-15T10:56:00Z',
        confirmedAt: '2025-07-15T10:58:00Z',
    },
    {
        id: 'TXN-041',
        chain: 'ltc',
        type: 'deposit',
        status: 'completed',
        amount: 3000,
        usdValue: 18900.0,
        fee: 0.14,
        txHash: 'e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5',
        fromAddress: EXT_LTC,
        toAddress: WALLET_LTC,
        createdAt: '2025-08-21T14:19:00Z',
        confirmedAt: '2025-08-21T14:27:00Z',
    },
    // ── In-flight (does not affect balances until confirmed) ───────
    {
        id: 'TXN-031',
        chain: 'eth',
        type: 'withdrawal',
        status: 'pending',
        amount: 0.5,
        usdValue: 1373.25,
        fee: 5.2,
        txHash: '0x9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b1d3f5a7c9e1b3d5f7a9c1',
        fromAddress: WALLET_EVM,
        toAddress: EXT_EVM,
        createdAt: '2026-09-10T09:15:00Z',
        confirmedAt: null,
        note: 'Awaiting two-factor confirmation',
    },
];

/**
 * Featured "recent withdrawal" for the dashboard card — derived from the
 * reconciled ledger so it can never disagree with the history. The newest
 * completed withdrawal (TXN-030) is dated exactly 2 years ago.
 */
export const MOCK_RECENT_WITHDRAWAL: Transaction = [...MOCK_TRANSACTIONS]
    .filter((t) => t.type === 'withdrawal' && t.status === 'completed')
    .sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];

export const MOCK_HISTORY: PortfolioPoint[] = [
    { label: 'Jan', value: 480000 },
    { label: 'Feb', value: 512000 },
    { label: 'Mar', value: 548000 },
    { label: 'Apr', value: 541000 },
    { label: 'May', value: 592000 },
    { label: 'Jun', value: 638000 },
    { label: 'Jul', value: 614000 },
    { label: 'Aug', value: 798000 },
    { label: 'Sep', value: 834763.18 },
    { label: 'Nov', value: 1134763.18 },
    { label: 'Feb', value: 1481597.18 },
    { label: 'Aug', value: 1834763.18 },
];

export const MOCK_SECURITY: SecurityStatus = {
    twoFactorEnabled: true,
    lastLogin: '2024-09-05T14:22:00Z',
    lastLoginDevice: 'Chrome on macOS',
    nonCustodial: true,
};

export const MOCK_PREFERENCES: Preference[] = [
    { event: 'deposit_received', email: true, inApp: true },
    { event: 'withdrawal_sent', email: true, inApp: true },
    { event: 'new_device_login', email: true, inApp: false },
    { event: 'price_alerts', email: false, inApp: true },
];

export const MOCK_RECOVERY_WORDS = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent',
    'absorb', 'abstract', 'abuse', 'access', 'accident', 'account',
    'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
    'action', 'actor', 'actress', 'activity', 'actual', 'adapt',
    'address', 'adjust', 'admit', 'adult', 'advance', 'advice',
    'aerobic', 'affair', 'afford', 'afraid', 'again', 'age',
    'agent', 'agree', 'ahead', 'aim', 'air', 'airport',
    'aisle', 'alarm', 'album', 'alcohol', 'alert', 'alien',
    'all', 'alley', 'allow', 'almost', 'alone', 'alpha',
    'already', 'also', 'alter', 'always', 'amateur', 'amazing',
    'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient',
    'anger', 'angle', 'angry', 'animal', 'ankle', 'announce',
    'annual', 'another', 'answer', 'antenna', 'antique', 'anxiety',
    'any', 'apart', 'apology', 'appear', 'apple', 'approve',
    'april', 'arch', 'arctic', 'area', 'arena', 'argue',
    'arm', 'armed', 'armor', 'army', 'around', 'arrange',
    'arrest', 'arrive', 'arrow', 'art', 'artefact', 'artist',
    'artwork', 'aspect', 'asset', 'attend', 'august', 'aunt',
    'author', 'auto', 'autumn', 'average', 'avocado', 'avoid',
    'awake', 'aware', 'away', 'awesome', 'awful', 'awkward',
    'axis', 'baby', 'bachelor', 'bacon', 'badge', 'bag',
    'balance', 'balcony', 'ball', 'bamboo', 'banana', 'banner',
    'bar', 'barely', 'bargain', 'barrel', 'base', 'basic',
    'basket', 'battle', 'beach', 'bean', 'beauty', 'because',
    'become', 'beef', 'before', 'begin', 'behavior', 'behind',
    'believe', 'below', 'belt', 'bench', 'benefit', 'best',
    'betray', 'better', 'between', 'beyond', 'bicycle', 'bid',
    'bike', 'bind', 'biology', 'bird', 'birth', 'bitter',
    'black', 'blade', 'blame', 'blanket', 'blast', 'bleak',
    'bless', 'blind', 'blood', 'blossom', 'blouse', 'blue',
    'blur', 'blush', 'board', 'boat', 'body', 'boil',
    'bomb', 'bone', 'bonus', 'book', 'boost', 'border',
    'boring', 'borrow', 'boss', 'bottom', 'bounce', 'box',
    'boy', 'bracket', 'brain', 'brand', 'brass', 'brave',
    'bread', 'breeze', 'brick', 'bridge', 'brief', 'bright',
    'bring', 'brisk', 'broccoli', 'broken', 'bronze', 'broom',
    'brother', 'bubble', 'bud', 'budget', 'buffalo', 'build',
    'bulb', 'bulk', 'bullet', 'bundle', 'bunny', 'burden',
    'burger', 'burst', 'bus', 'business', 'busy', 'butter',
    'buyer', 'buzz', 'cabbage', 'cabin', 'cable', 'cactus',
    'cage', 'cake', 'call', 'calm', 'camera', 'camp',
    'can', 'canal', 'cancel', 'candy', 'cannon', 'canoe',
    'canvas', 'canyon', 'capable', 'capital', 'captain', 'car',
    'carbon', 'card', 'cargo', 'carpet', 'carry', 'cart',
    'case', 'cash', 'casino', 'castle', 'casual', 'cat',
    'catalog', 'catch', 'category', 'cattle', 'caught', 'cause',
    'caution', 'cave', 'ceiling', 'celery', 'cement', 'census',
    'century', 'cereal', 'certain', 'chair', 'chalk', 'champion',
    'change', 'chaos', 'chapter', 'charge', 'chase', 'chat',
    'cheap', 'check', 'cheese', 'chef', 'cherry', 'chest',
    'chicken', 'chief', 'child', 'chimney', 'choice', 'choose',
    'chronic', 'chuckle', 'chunk', 'churn', 'cigar', 'cinnamon',
    'circle', 'citizen', 'city', 'civil', 'claim', 'clap',
    'clarify', 'claw', 'clay', 'clean', 'clerk', 'clever',
    'click', 'client', 'cliff', 'climb', 'clinic', 'clip',
    'closet', 'clown', 'cloud', 'clown', 'club', 'clump',
    'cluster', 'clutch', 'coach', 'coast', 'cobweb', 'code',
    'coffee', 'coil', 'coin', 'collect', 'color', 'column',
    'comb', 'come', 'comfort', 'comic', 'common', 'company',
    'concert', 'conduct', 'confirm', 'congress', 'connect', 'consider',
    'control', 'convince', 'cook', 'cool', 'copper', 'copy',
    'coral', 'core', 'corn', 'correct', 'cost', 'cotton',
    'couch', 'country', 'couple', 'course', 'cousin', 'cover',
    'coyote', 'crack', 'cradle', 'craft', 'cram', 'crane',
    'crash', 'crater', 'crawl', 'crazy', 'cream', 'credit',
    'creek', 'crew', 'crick', 'crime', 'crisp', 'critic',
    'crop', 'cross', 'crouch', 'crowd', 'crucial', 'cruel',
    'cruise', 'crunch', 'crush', 'cry', 'crystal', 'cube',
    'culture', 'cup', 'cupboard', 'curious', 'current', 'curtain',
    'curve', 'cushion', 'custom', 'cute', 'cycle', 'dad',
    'damage', 'dance', 'danger', 'daring', 'dash', 'daughter',
    'dawn', 'day', 'deal', 'debate', 'debris', 'decade',
    'december', 'decide', 'decline', 'decorate', 'decrease', 'deer',
    'defense', 'define', 'defy', 'degree', 'delay', 'deliver',
    'demand', 'demise', 'denial', 'dentist', 'deny', 'depart',
    'depend', 'deposit', 'depth', 'deputy', 'derive', 'describe',
    'desert', 'design', 'desk', 'despair', 'destroy', 'detail',
    'detect', 'develop', 'device', 'devote', 'diagram', 'dial',
    'diamond', 'diary', 'dice', 'diesel', 'diet', 'differ',
    'digital', 'dignity', 'dilemma', 'dinner', 'dinosaur', 'direct',
    'dirt', 'disagree', 'discover', 'disease', 'dish', 'dismiss',
    'disorder', 'display', 'distance', 'divert', 'divide', 'divorce',
    'dizzy', 'doctor', 'document', 'dog', 'doll', 'dolphin',
    'domain', 'donate', 'donkey', 'donor', 'door', 'dose',
    'double', 'dove', 'draft', 'dragon', 'drama', 'drastic',
    'draw', 'dream', 'dress', 'drift', 'drill', 'drink',
    'drip', 'drive', 'drop', 'drum', 'dry', 'duck',
    'dumb', 'dune', 'during', 'dust', 'dutch', 'duty',
    'dwarf', 'dynamic', 'eager', 'eagle', 'early', 'earn',
    'earth', 'easily', 'east', 'easy', 'echo', 'ecology',
    'economy', 'edge', 'edit', 'educate', 'effort', 'egg',
    'eight', 'either', 'elbow', 'elder', 'electric', 'elegant',
    'element', 'elephant', 'elevator', 'elite', 'else', 'embark',
    'embody', 'embrace', 'emerge', 'emotion', 'employ', 'empower',
    'empty', 'enable', 'enact', 'end', 'endless', 'endorse',
    'enemy', 'energy', 'enforce', 'engage', 'engine', 'enhance',
    'enjoy', 'enlist', 'enough', 'enrich', 'enroll', 'ensure',
    'enter', 'entire', 'entry', 'envelope', 'episode', 'equal',
    'equip', 'era', 'erase', 'erode', 'erosion', 'error',
    'erupt', 'escape', 'essay', 'essence', 'estate', 'eternal',
    'ethics', 'evidence', 'evil', 'evoke', 'evolve', 'exact',
    'example', 'excess', 'exchange', 'excite', 'exclude', 'excuse',
    'execute', 'exercise', 'exhaust', 'exhibit', 'exile', 'exist',
    'exit', 'exotic', 'expand', 'expect', 'expire', 'explain',
    'expose', 'express', 'extend', 'extra', 'eye', 'eyebrow',
];

export const initialPreferences = MOCK_PREFERENCES;
