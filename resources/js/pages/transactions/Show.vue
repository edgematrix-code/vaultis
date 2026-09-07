<script setup lang="ts">
import { computed } from 'vue';
import { Head, Link } from '@/lib/inertia-shim';
import { ArrowLeft, ExternalLink } from '@lucide/vue';
import ChainGlyph from '@/components/wallet/ChainGlyph.vue';
import TransactionStatusBadge from '@/components/wallet/TransactionStatusBadge.vue';
import {
    CHAINS,
    explorerUrl,
    formatCrypto,
    formatUsd,
} from '@/lib/wallet-data';
import { MOCK_TRANSACTIONS } from '@/lib/data';
import type { Transaction } from '@/types/wallet';

const props = defineProps<{
    transaction?: Transaction;
}>();

const transaction = computed(() => props.transaction ?? MOCK_TRANSACTIONS[0]);
const chain = computed(() => CHAINS[transaction.value.chain]);

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Transactions', href: '/transactions' },
            { title: 'Detail', href: '#' },
        ],
    },
});

const rows = computed(() => [
    { label: 'Status', value: null, badge: true },
    { label: 'Type', value: transaction.value.type },
    {
        label: 'Amount',
        value: `${formatCrypto(transaction.value.amount)} ${chain.value.symbol}`,
    },
    { label: 'Value', value: formatUsd(transaction.value.usdValue) },
    {
        label: 'Network fee',
        value:
            transaction.value.fee > 0
                ? formatUsd(transaction.value.fee)
                : 'Sponsored',
    },
    { label: 'From', value: transaction.value.fromAddress, mono: true },
    { label: 'To', value: transaction.value.toAddress, mono: true },
    {
        label: 'Submitted',
        value: new Date(transaction.value.createdAt).toLocaleString(),
    },
    {
        label: 'Confirmed',
        value: transaction.value.confirmedAt
            ? new Date(transaction.value.confirmedAt).toLocaleString()
            : '—',
    },
]);
</script>

<template>
    <Head title="Transaction detail" />

    <div class="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 p-4 md:p-6">
        <Link
            href="/transactions"
            class="text-vault-ink-dim hover:text-foreground flex items-center gap-1.5 text-sm"
        >
            <ArrowLeft class="size-4" /> Back to transactions
        </Link>

        <div class="border-border bg-card rounded-2xl border p-6">
            <div class="flex items-center gap-3">
                <ChainGlyph :chain="props.transaction.chain" size="lg" />
                <div>
                    <p class="text-foreground text-lg font-semibold capitalize">
                        {{ props.transaction.type }} · {{ chain.name }}
                    </p>
                    <p class="text-vault-ink-dim text-xs">
                        {{ props.transaction.id }}
                    </p>
                </div>
            </div>

            <div
                v-if="props.transaction.note"
                class="border-vault-rose/30 bg-vault-rose/10 text-vault-rose mt-4 rounded-xl border p-3 text-sm"
            >
                {{ props.transaction.note }}
            </div>

            <dl class="divide-border mt-6 divide-y">
                <div
                    v-for="row in rows"
                    :key="row.label"
                    class="flex items-center justify-between gap-4 py-3"
                >
                    <dt class="text-vault-ink-dim text-sm">{{ row.label }}</dt>
                    <dd
                        :class="[
                            'text-foreground text-right text-sm',
                            row.mono &&
                                'max-w-[220px] truncate font-mono text-xs',
                        ]"
                    >
                        <TransactionStatusBadge
                            v-if="row.badge"
                            :status="props.transaction.status"
                        />
                        <span v-else class="tnum">{{ row.value }}</span>
                    </dd>
                </div>
            </dl>

            <a
                :href="
                    explorerUrl(
                        props.transaction.chain,
                        props.transaction.txHash,
                    )
                "
                target="_blank"
                rel="noopener noreferrer"
                class="border-border text-foreground hover:border-vault-mint/40 hover:text-vault-mint mt-6 flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium"
            >
                View on block explorer
                <ExternalLink class="size-4" />
            </a>
        </div>
    </div>
</template>
