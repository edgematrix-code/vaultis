<script setup lang="ts">
import { computed, ref } from 'vue';
import { Check, Copy } from '@lucide/vue';
import ChainGlyph from '@/components/wallet/ChainGlyph.vue';
import { CHAINS } from '@/lib/wallet-data';
import type { ChainId } from '@/types/wallet';

const props = defineProps<{
    chain: ChainId;
}>();

const qrAsset = [
    { chain: 'btc', file: 'BTC.jpg' },
    { chain: 'eth', file: 'ETHEREUM.jpg' },
    { chain: 'bsc', file: 'BNB.jpg' },
    { chain: 'sol', file: 'SOLANA.jpg' },
    { chain: 'ltc', file: 'LITECOIN.jpg' },
    { chain: 'trx', file: 'TRON.jpg' },
    { chain: 'usdt-trc', file: 'TRON(TRC).jpg' },
    { chain: 'usdt-erc', file: 'USDT(ERC).jpg' },
    { chain: 'usdt-bsc', file: 'USDT(BSC).jpg' },
    { chain: 'usdc-eth', file: 'USDC(ETHEREUM).jpg' },
];

const qrSrc = computed(() => {
    const entry = qrAsset.find((q) => q.chain === props.chain);
    return entry ? `/TOKENS-QRCODE-IMAGE/${entry.file}` : null;
});



</script>

<template>
    <div
        class="border-border bg-card flex flex-col items-center gap-5 rounded-2xl border p-6 text-center sm:p-8"
    >
        <div v-if="qrSrc" class="border-border rounded-2xl border bg-white p-4">
            <img
                :src="qrSrc"
                :alt="`${CHAINS[chain].symbol} deposit QR`"
                class="h-auto max-w-full"
                loading="lazy"
            />
        </div>
        <div v-else class="border-border rounded-2xl border bg-white p-4">
            <p class="text-vault-ink-dim text-sm">
                QR code unavailable
            </p>
        </div>

        <div class="flex items-center gap-2">
            <ChainGlyph :chain="chain" size="sm" />
        </div>
    </div>
</template>
