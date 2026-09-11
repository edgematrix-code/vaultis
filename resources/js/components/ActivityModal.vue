<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { X } from '@lucide/vue';
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

function buildEntries(): Array<{ text: string; chain: ChainId }> {
    const pools: Array<{ name: string; chain: ChainId }> = [
        { name: 'USDT', chain: 'usdt-erc' },
        { name: 'USDC', chain: 'usdc-eth' },
        { name: 'BTC', chain: 'btc' },
        { name: 'ETH', chain: 'eth' },
        { name: 'BNB', chain: 'bsc' },
        { name: 'TRX', chain: 'trx' },
    ];

    const entries: Array<{ text: string; chain: ChainId }> = [];
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
        entries.push({
            text: useSecondName
                ? `${firstName} ${verb} ${amount} ${p.name} to ${firstName2}`
                : `${firstName} ${verb} ${amount} ${p.name}`,
            chain: p.chain,
        });
    }

    return entries;
}

const allEntries = buildEntries();
const currentIndex = ref(0);
const visible = ref(false);
const entering = ref(false);
const leaving = ref(false);

let interval: ReturnType<typeof setInterval>;
const ROTATION_MS = 15000; // 15 seconds per entry

function showNext() {
    if (leaving.value) return;
    const entry = allEntries[currentIndex.value];
    currentIndex.value = (currentIndex.value + 1) % allEntries.length;
    entering.value = true;
    visible.value = true;
    setTimeout(() => {
        entering.value = false;
        setTimeout(() => {
            leaving.value = true;
            setTimeout(() => {
                leaving.value = false;
                visible.value = false;
                setTimeout(showNext, 2000);
            }, 600);
        }, 9000);
    }, 350);
}

onMounted(() => {
    setTimeout(() => {
        showNext();
        interval = setInterval(() => {
            if (!visible.value) showNext();
        }, ROTATION_MS);
    }, 1500);
});

onUnmounted(() => {
    clearInterval(interval);
});

function randomAgo(): string {
    const mins = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 20, 25, 30];
    const m = mins[Math.floor(Math.random() * mins.length)];
    return `${m} min${m === 1 ? '' : 's'} ago`;
}

const current = computed(() => ({
    ...allEntries[currentIndex.value],
    ago: randomAgo(),
}));
</script>

<template>
    <!-- This modal floats over the page content area -->
    <Teleport to="body">
        <Transition
            enter-active-class="transition duration-350 ease-out"
            leave-active-class="transition duration-350 ease-in"
            enter-from-class="opacity-0 translate-y-4 scale-95"
            leave-to-class="opacity-0 translate-y-2 scale-95"
        >
            <div
                v-if="visible"
                class="fixed right-0 z-50 bottom-6 flex w-[80%] max-w-[80vw] items-center gap-2.5 rounded-xl border bg-card/90 px-4 py-2.5 backdrop-blur-xl shadow-2xl shadow-black/30"
            >                        <ChainGlyph
                            :chain="current.chain"
                            size="sm"
                            class="h-3.5 w-3.5"
                        />

                <div class="min-w-0">
                    <p class="text-foreground text-[11px] font-semibold leading-5">
                        {{ current.text }}
                    </p>
                    <p class="text-vault-ink-dim text-[10px] mt-0.5">
                        {{ current.ago }}
                    </p>
                </div>

                <button
                    class="ml-1 shrink-0 text-vault-ink-dim transition-colors hover:text-foreground"
                    @click="leaving = true; setTimeout(() => { visible = false; }, 350)"
                >
                    <X class="size-4" />
                </button>
            </div>
        </Transition>
    </Teleport>
</template>
