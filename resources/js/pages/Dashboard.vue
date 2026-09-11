<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink as Link } from 'vue-router';
import { ArrowRight } from '@lucide/vue';
import ActivityModal from '@/components/ActivityModal.vue';
import AssetRow from '@/components/wallet/AssetRow.vue';
import BalanceCard from '@/components/wallet/BalanceCard.vue';
import QuickActions from '@/components/wallet/QuickActions.vue';
import BalanceHistory from '@/components/charts/BalanceHistory.vue';
import PortfolioDonut from '@/components/charts/PortfolioDonut.vue';
import { getPortfolioChangePct, getPortfolioTotal } from '@/lib/wallet-data';
import {
    MOCK_BALANCES,
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

            <div class="border-border bg-card rounded-2xl border p-6">
                <ActivityModal />
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
    </div>
</template>
