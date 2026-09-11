<script setup lang="ts">
import { ref, computed } from 'vue';
import ChainGlyph from '@/components/wallet/ChainGlyph.vue';
import type { ChainId } from '@/types/wallet';
import { CHAINS } from '@/lib/wallet-data';

const firstNames = [
    'Mike', 'Larry', 'Sarah', 'James', 'Emma', 'David', 'Sophia',
    'Marcus', 'Olivia', 'Ethan', 'Ava', 'Ryan', 'Isabella', 'Noah',
    'Mia', 'Lucas', 'Charlotte', 'Oliver', 'Amelia', 'Elijah',
    'Harper', 'William', 'Evelyn', 'Henry', 'Abigail', 'Alexander',
    'Emily', 'Sebastian', 'Ella', 'Jack', 'Avery', 'Owen', 'Sofia',
    'Aiden', 'Grace', 'Samuel', 'Chloe', 'Daniel', 'Victoria', 'Matthew',
    'Riley', 'Joseph', 'Aria', 'Carter', 'Lily', 'Wyatt', 'Aurora',
    'John', 'Zoey', 'Luke', 'Nora', 'Jayden', 'Luna', 'Dylan',
    'Stella', 'Grayson', 'Hannah', 'Levi', 'Maya', 'Isaac', 'Ellie',
    'Gabriel', 'Aaliyah', 'Julian', 'Scarlett', 'Mateo', 'Brooklyn',
    'Lincoln', 'Paisley', 'Theodore', 'Claire', 'Dominic', 'Skylar',
    'Leo', 'Anna', 'Anthony', 'Penelope', 'Jaxon', 'Kennedy', 'Hudson',
    'Samantha', 'Leona', 'Adeline', 'Colton', 'Natalie', 'Xavier',
    'Madelyn', 'Jade', 'Kai', 'Layla', 'Ezra', 'Naomi', 'Miles',
    'Elena', 'Asher', 'Virginia', 'Finn', 'Caleb',
    'Violet', 'Eleanor', 'Dean', 'Imogen', 'Beau',
    'Josephine', 'Archie', 'Bella', 'Patrick', 'Esme', 'Kyrie',
    'Margaret', 'Troy', 'Lydia', 'Victor', 'Ada', 'Ivor',
];

const actionVerbs = [
    'transferred', 'sent', 'deposited', 'withdrew', 'moved',
    'swapped', 'converted', 'paid', 'received', 'cashed out',
];

// Generate 220 varied activity entries
function buildEntries(): string[] {
    const pools: Array<{ name: string; chain: ChainId }> = [
        { name: 'USDT', chain: 'usdt-erc' },
        { name: 'USDC', chain: 'usdc-eth' },
        { name: 'BTC', chain: 'btc' },
        { name: 'ETH', chain: 'eth' },
        { name: 'BNB', chain: 'bsc' },
        { name: 'TRX', chain: 'trx' },
    ];

    const entries: string[] = [];
    let seed = 0;

    for (let i = 0; i < 220; i++) {
        seed += 7 + (i % 13);
        const p = pools[(seed >> 3) % pools.length];
        const verb = actionVerbs[(seed + i) % actionVerbs.length];
        const firstName = firstNames[(seed + i * 11) % firstNames.length];
        const firstName2 = firstNames[(seed + i * 5 + 3) % firstNames.length];

        let amount: string;
        if (p.chain === 'btc') {
            amount = (0.001 + ((seed % 900) / 1000)).toFixed(4);
        } else if (p.chain === 'eth') {
            amount = (0.01 + ((seed % 700) / 100)).toFixed(3);
        } else if (p.chain === 'bsc') {
            amount = (0.5 + ((seed % 500) / 10)).toFixed(2);
        } else if (p.chain === 'trx') {
            amount = (10 + (seed % 9900)).toLocaleString();
        } else {
            amount = '$' + (10 + (seed % 49990)).toLocaleString();
        }

        const useSecondName = seed % 3 === 0;
        entries.push(
            useSecondName
                ? `${firstName} ${verb} ${amount} ${p.name} to ${firstName2}`
                : `${firstName} ${verb} ${amount} ${p.name}`,
        );
    }

    return entries;
}

const allEntries = ref(buildEntries());
const baseIndex = ref(0);
const speed = 38;
const itemGap = 4;
const baseItemWidth = 340;

const doubled = computed(() => [...allEntries.value, ...allEntries.value]);

const paused = ref(false);

const translateX = computed(() => {
    const offset = paused.value ? 0 : -(baseIndex.value * (baseItemWidth + itemGap));
    return offset % (allEntries.value.length * (baseItemWidth + itemGap));
});

function chainForEntry(raw: string): ChainId {
    if (raw.includes('USDT')) return 'usdt-erc';
    if (raw.includes('USDC')) return 'usdc-eth';
    if (raw.includes('BTC')) return 'btc';
    if (raw.includes('ETH')) return 'eth';
    if (raw.includes('BNB')) return 'bsc';
    if (raw.includes('TRX')) return 'trx';
    return 'eth';
}

let lastTs = 0;
function tick(ts: number) {
    if (!lastTs) lastTs = ts;
    const delta = (ts - lastTs) / 1000;
    lastTs = ts;
    if (!paused.value) {
        baseIndex.value = (baseIndex.value + delta * speed / (baseItemWidth + itemGap)) % allEntries.value.length;
    }
    requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
</script>

<template>
    <div class="overflow-hidden">
        <p class="text-vault-ink-dim text-xs font-semibold tracking-widest uppercase">
            Recent activity
        </p>

        <div
            class="relative mt-3 overflow-hidden"
            :class="{ 'opacity-50': paused }"
            @mouseenter="paused = true"
            @mouseleave="paused = false"
        >
            <div
                class="flex gap-1 animate-none will-change-transform select-none"
                :style="{ transform: `translateX(${translateX}px)` }"
            >
                <template v-for="(raw, i) in doubled" :key="i">
                    <div
                        class="flex shrink-0 items-center gap-2 rounded-lg border bg-card/80 px-3 py-2 backdrop-blur-sm transition-colors hover:bg-card hover:border-vault-mint/40 whitespace-nowrap"
                        :style="{ width: baseItemWidth + 'px' }"
                    >
                        <ChainGlyph
                            :chain="chainForEntry(raw)"
                            size="xs"
                        />
                        <span class="text-foreground text-xs font-medium leading-5 truncate">
                            {{ raw }}
                        </span>
                    </div>
                </template>
            </div>

            <div class="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-card/90 via-transparent to-transparent" />
            <div class="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card/90 via-transparent to-transparent" />
        </div>
    </div>
</template>
