<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink as Link } from 'vue-router';
import { ArrowRight } from '@lucide/vue';
import ActivityModal from '@/components/ActivityModal.vue';
import ChainGlyph from '@/components/wallet/ChainGlyph.vue';
import TransactionStatusBadge from '@/components/wallet/TransactionStatusBadge.vue';
import AssetRow from '@/components/wallet/AssetRow.vue';
import BalanceCard from '@/components/wallet/BalanceCard.vue';
import QuickActions from '@/components/wallet/QuickActions.vue';
import BalanceHistory from '@/components/charts/BalanceHistory.vue';
import PortfolioDonut from '@/components/charts/PortfolioDonut.vue';
import {
    CHAINS,
    formatCrypto,
    formatRelativeTimeLong,
    formatUsd,
    getPortfolioChangePct,
    getPortfolioTotal,
    truncateAddress,
} from '@/lib/wallet-data';
import {
    MOCK_BALANCES,
    MOCK_RECENT_WITHDRAWAL,
    MOCK_TRANSACTIONS,
    MOCK_HISTORY,
    MOCK_SECURITY,
} from '@/lib/data';
import type {
    AssetBalance,
    PortfolioPoint,
    SecurityStatus,
    Transaction,
} from '@/types/wallet';

defineOptions({
    layout: {
        breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }],
    },
});

const props = defineProps<{
    balances?: AssetBalance[];
    transactions?: Transaction[];
    history?: PortfolioPoint[];
    security?: SecurityStatus;
}>();

const balances = ref<AssetBalance[]>(props.balances ?? MOCK_BALANCES);
const transactions = ref<Transaction[]>(props.transactions ?? MOCK_TRANSACTIONS);
const history = ref<PortfolioPoint[]>(props.history ?? MOCK_HISTORY);
const security = ref<SecurityStatus>(props.security ?? MOCK_SECURITY);

const recentWithdrawal = computed(() => {
    const withdrawals = [...transactions.value]
        .filter((t) => t.type === 'withdrawal' && t.status === 'completed')
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        );
    return withdrawals[0] ?? MOCK_RECENT_WITHDRAWAL;
});

const total = computed(() => getPortfolioTotal(balances.value));
const totalChangePct = computed(() =>
    getPortfolioChangePct(balances.value, total.value),
);
</script>

<template>
    <Head title="Dashboard" />

    <div class="flex flex-1 flex-col gap-5 p-4 md:p-6">
        <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <BalanceCard
                :total="total"
                :change-pct="totalChangePct"
                :security="security"
            />
            <QuickActions />
        </div>

        <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <PortfolioDonut :balances="balances" :total="total" />
            <BalanceHistory :history="history" />
        </div>

        <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div
                class="border-border bg-card rounded-2xl border p-6 lg:col-span-2"
            >
                <!-- Security badge -->
                <div class="mb-3 flex items-center justify-between">
                    <img
                        src="/security_transparent.png"
                        alt="Security"
                        class="size-18 object-contain sm:size-12"
                    />
                    <Link
                        to="/wallet"
                        class="text-vault-mint flex items-center gap-1 text-xs font-medium hover:underline"
                    >
                        View wallet
                        <ArrowRight class="size-3.5" />
                    </Link>
                </div>
                <div class="mb-2 flex items-center justify-between">
                    <p class="text-vault-ink-dim text-sm">Assets</p>
                    <Link
                        to="/wallet"
                        class="text-vault-mint flex items-center gap-1 text-xs font-medium hover:underline"
                    >
                        View wallet
                        <ArrowRight class="size-3.5" />
                    </Link>
                </div>
                <div class="divide-border divide-y">
                    <AssetRow
                        v-for="b in balances"
                        :key="b.chain"
                        :balance="b"
                    />
                </div>
            </div>

            <div
                class="border-border bg-card flex flex-col rounded-2xl border p-6"
            >
                <div class="flex items-center justify-between">
                    <p class="text-vault-ink-dim text-sm">Recent withdrawal</p>
                    <TransactionStatusBadge
                        :status="recentWithdrawal.status"
                    />
                </div>

                <div class="mt-4 flex items-center gap-2.5">
                    <ChainGlyph :chain="recentWithdrawal.chain" size="sm" />
                    <div>
                        <p class="tnum text-foreground font-medium">
                            {{ formatCrypto(recentWithdrawal.amount) }}
                            {{ CHAINS[recentWithdrawal.chain].symbol }}
                        </p>
                        <p class="tnum text-vault-ink-dim text-xs">
                            {{ formatUsd(recentWithdrawal.usdValue) }}
                        </p>
                    </div>
                </div>

                <div class="mt-4 space-y-2 text-xs">
                    <div class="flex items-center justify-between gap-3">
                        <span class="text-vault-ink-dim">To</span>
                        <span
                            class="text-foreground truncate font-mono"
                            >{{
                                truncateAddress(recentWithdrawal.toAddress)
                            }}</span
                        >
                    </div>
                    <div class="flex items-center justify-between gap-3">
                        <span class="text-vault-ink-dim">Network fee</span>
                        <span class="tnum text-foreground"
                            >{{ formatUsd(recentWithdrawal.fee) }}</span
                        >
                    </div>
                    <div class="flex items-center justify-between gap-3">
                        <span class="text-vault-ink-dim">When</span>
                        <span class="text-foreground">{{
                            formatRelativeTimeLong(recentWithdrawal.createdAt)
                        }}</span>
                    </div>
                </div>

                <Link
                    to="/transactions"
                    class="text-vault-mint mt-4 flex items-center gap-1 text-xs font-medium hover:underline"
                >
                    View all transactions
                    <ArrowRight class="size-3.5" />
                </Link>
            </div>

            <!-- Bank scene illustration -->
            <div class="hidden lg:block border-border bg-card rounded-2xl border p-4">
                <img
                    src="/bank_scene_transparent.png"
                    alt="Vaultis secure banking"
                    class="h-full w-full object-contain max-h-[12rem]"
                />
            </div>
        </div>

        <!-- Floating live-activity toast (renders via Teleport, nothing in-place) -->
        <ActivityModal />
    </div>
</template>
