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

export type ChainId = 'btc' | 'eth' | 'bsc' | 'trx' | 'usdt' | 'usdc';

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
        name: 'Alex Morgan',
        email: 'alex@vaultis.io',
        email_verified_at: '2024-01-15T10:00:00Z',
        two_factor_enabled: true,
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-09-01T10:00:00Z',
    },
};

export const MOCK_BALANCES: AssetBalance[] = [
    {
        chain: 'btc',
        address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        balance: 0.08472911,
        usdValue: 5782.44,
        priceUsd: 68213.0,
        change24hPct: 1.23,
    },
    {
        chain: 'eth',
        address: '0x71C67B943i4cDa31Ae7b71B3bE7b9D3b4fF6c7b9',
        balance: 2.3415,
        usdValue: 6432.18,
        priceUsd: 2746.5,
        change24hPct: -0.87,
    },
    {
        chain: 'bsc',
        address: '0x71C67B943i4cDa31Ae7b71B3bE7b9D3b4fF6c7b9',
        balance: 15.4,
        usdValue: 4521.0,
        priceUsd: 293.5,
        change24hPct: 2.14,
    },
    {
        chain: 'trx',
        address: 'TF1234567890ABCDEF1234567890ABCDEF12345678',
        balance: 5800,
        usdValue: 552.4,
        priceUsd: 0.0952,
        change24hPct: 0.56,
    },
    {
        chain: 'usdt',
        address: '0x71C67B943i4cDa31Ae7b71B3bE7b9D3b4fF6c7b9',
        balance: 12400,
        usdValue: 12400.0,
        priceUsd: 1.0,
        change24hPct: 0.01,
    },
    {
        chain: 'usdc',
        address: '0x71C67B943i4cDa31Ae7b71B3bE7b9D3b4fF6c7b9',
        balance: 8600,
        usdValue: 8600.0,
        priceUsd: 1.0,
        change24hPct: -0.03,
    },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: 'TXN-001',
        chain: 'btc',
        type: 'deposit',
        status: 'completed',
        amount: 0.025,
        usdValue: 1705.33,
        fee: 2.5,
        txHash: '4a5e1e4baab8926ab1800965d70d5412fc2f5e0b1b1c3f7e8a9b0c1d2e3f4a5b',
        fromAddress: 'bc1qrecipient1234567890abcdef1234567890abcdef',
        toAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        createdAt: '2024-08-28T14:30:00Z',
        confirmedAt: '2024-08-28T14:45:00Z',
    },
    {
        id: 'TXN-002',
        chain: 'eth',
        type: 'withdrawal',
        status: 'pending',
        amount: 0.5,
        usdValue: 1373.25,
        fee: 5.2,
        txHash: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
        fromAddress: '0x71C67B943i4cDa31Ae7b71B3bE7b9D3b4fF6c7b9',
        toAddress: '0xrecipient9876543210abcdef9876543210abcdef9876',
        createdAt: '2024-09-01T09:15:00Z',
        confirmedAt: null,
    },
    {
        id: 'TXN-003',
        chain: 'bsc',
        type: 'internal',
        status: 'completed',
        amount: 5.0,
        usdValue: 1467.5,
        fee: 0,
        txHash: 'internal-txn-003',
        fromAddress: '0x71C67B943i4cDa31Ae7b71B3bE7b9D3b4fF6c7b9',
        toAddress: '0x71C67B943i4cDa31Ae7b71B3bE7b9D3b4fF6c7b9',
        createdAt: '2024-08-25T11:20:00Z',
        confirmedAt: '2024-08-25T11:20:05Z',
    },
    {
        id: 'TXN-004',
        chain: 'trx',
        type: 'deposit',
        status: 'completed',
        amount: 1000,
        usdValue: 95.2,
        fee: 0.1,
        txHash: '004a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a',
        fromAddress: 'Trecipient1234567890ABCDEF1234567890ABCDEF',
        toAddress: 'TF1234567890ABCDEF1234567890ABCDEF12345678',
        createdAt: '2024-08-20T16:00:00Z',
        confirmedAt: '2024-08-20T16:05:00Z',
    },
    {
        id: 'TXN-005',
        chain: 'usdt',
        type: 'withdrawal',
        status: 'completed',
        amount: 2500,
        usdValue: 2500.0,
        fee: 3.0,
        txHash: '0x1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
        fromAddress: '0x71C67B943i4cDa31Ae7b71B3bE7b9D3b4fF6c7b9',
        toAddress: '0xrecipientabcde1234567890abcdef1234567890abcdef',
        createdAt: '2024-08-18T12:45:00Z',
        confirmedAt: '2024-08-18T12:50:00Z',
    },
];

export const MOCK_HISTORY: PortfolioPoint[] = [
    { label: 'Jan', value: 8200 },
    { label: 'Feb', value: 9400 },
    { label: 'Mar', value: 11200 },
    { label: 'Apr', value: 10800 },
    { label: 'May', value: 12500 },
    { label: 'Jun', value: 13800 },
    { label: 'Jul', value: 12900 },
    { label: 'Aug', value: 15200 },
    { label: 'Sep', value: 15615.84 },
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
