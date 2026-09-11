<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Head } from '@/lib/inertia-shim';
import { ArrowRight, ArrowDown, Check, Copy, Loader2 } from '@lucide/vue';
import { useForm } from '@/lib/form';
import { toast } from 'vue-sonner';
import ChainSelect from '@/components/wallet/ChainSelect.vue';
import QRAddress from '@/components/wallet/QRAddress.vue';
import { CHAINS, TOKEN_ADDRESSES, TOKEN_NETWORKS } from '@/lib/wallet-data';
import type { ChainId } from '@/types/wallet';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Wallet', href: '/wallet' },
            { title: 'Deposit', href: '/wallet/deposit' },
        ],
    },
});

const selected = ref<ChainId>('btc');
const network = ref<ChainId>('btc');
const amount = ref<string>('');
const processing = ref(false);
const deposited = ref(false);
const copied = ref(false);

const chain = computed(() => CHAINS[selected.value]);
const currentNetwork = computed(() => CHAINS[network.value]);

const address = computed(() => {
    return TOKEN_ADDRESSES[selected.value]?.[network.value] ?? '';
});

const tokenNetworks = computed(() => {
    const ids = TOKEN_NETWORKS[selected.value];
    if (!ids) return [selected.value];
    return ids.length ? ids : [selected.value];
});

// Auto-select first network when token changes
watch(
    selected,
    (token) => {
        const ids = TOKEN_NETWORKS[token];
        network.value = ids?.[0] ?? token;
    },
    { immediate: true },
);

function copyAddress() {
    if (!address.value) return;
    navigator.clipboard?.writeText(address.value).then(() => {
        copied.value = true;
        toast.success('Address copied to clipboard');
        setTimeout(() => {
            copied.value = false;
        }, 2000);
    }).catch(() => {
        toast.error('Failed to copy address');
    });
}

async function deposit() {
    if (!address.value || !amount.value) {
        toast.error('Please select a token/network and enter an amount');
        return;
    }
    const amt = parseFloat(amount.value);
    if (!amt || amt <= 0) {
        toast.error('Enter a valid amount');
        return;
    }

    processing.value = true;
    try {
        const form = useForm({
            token: selected.value,
            network: network.value,
            amount: amt,
            address: address.value,
        });
        await form.post('/wallet/deposit', {
            onSuccess: () => {
                deposited.value = true;
                toast.success('Deposit initiated successfully');
            },
            onError: (errors) => {
                toast.error(errors?.message ?? 'Deposit failed, please try again');
            },
        });
    } catch (e) {
        toast.error('Network error — please try again');
    } finally {
        processing.value = false;
    }
}
</script>

<template>
    <Head title="Deposit" />

    <div class="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <div>
            <h1 class="text-foreground text-xl font-semibold tracking-tight">
                Deposit
            </h1>
            <p class="text-vault-ink-dim mt-1 max-w-md text-sm">
                Choose which asset you're sending, then we'll show the correct
                receiving address and network.
            </p>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            <div class="border-border bg-card rounded-2xl border p-6">
                <p class="text-foreground mb-4 text-sm font-medium">
                    Select an asset
                </p>
                <ChainSelect v-model="selected" />

                <div class="mt-6">
                    <p class="text-foreground mb-4 text-sm font-medium">
                        Select network
                    </p>
                    <div class="flex flex-wrap gap-2">
                        <button
                            v-for="netId in tokenNetworks"
                            :key="netId"
                            type="button"
                            @click="network = netId"
                            :class="[
                                'flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors',
                                network === netId
                                    ? 'border-vault-mint/50 bg-vault-mint/10'
                                    : 'border-border hover-border-vault-mint/30 hover:bg-secondary/60',
                            ]"
                        >
                            <span class="text-foreground text-sm font-medium">
                                {{ CHAINS[netId].symbol }}
                            </span>
                            <span class="text-vault-ink-dim text-xs">
                                {{ CHAINS[netId].network }}
                            </span>
                        </button>
                    </div>
                </div>

                <div class="mt-6">
                    <p class="text-foreground mb-4 text-sm font-medium">
                        Amount
                    </p>
                    <div class="flex rounded-xl border border-border bg-secondary/40 p-1 focus-within:border-vault-mint/40 focus-within:ring-1 focus-within:ring-vault-mint/30 transition-colors">
                        <input
                            v-model="amount"
                            type="text"
                            inputmode="decimal"
                            placeholder="0.00"
                            class="flex-1 bg-transparent text-foreground text-lg font-semibold outline-none placeholder:text-vault-ink-dim"
                        />
                        <span class="shrink-0 text-foreground text-sm font-medium">
                            {{ chain.symbol }}
                        </span>
                    </div>
                </div>
            </div>

            <div
                class="border-border bg-secondary/40 flex flex-col justify-between gap-6 rounded-2xl border p-6"
            >
                <div>
                    <p class="text-foreground text-sm font-medium">
                        {{ chain.name }} on {{ currentNetwork.name }}
                    </p>
                    <p class="text-vault-ink-dim mt-1 text-xs">
                        Deposits confirm automatically — no manual steps once
                        the transaction is broadcast on {{ chain.network }}.
                    </p>
                </div>

                <QRAddress v-if="address" :chain="network" :address="address" />

                <div v-if="address" class="flex flex-col gap-3">
                    <div
                        class="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2"
                    >
                        <span class="flex-1 font-mono text-sm text-foreground">
                            {{ address }}
                        </span>
                        <button
                            type="button"
                            @click="copyAddress"
                            class="shrink-0 text-vault-ink-dim hover:text-vault-mint transition-colors"
                        >
                            <Copy :class="['size-4', copied ? 'text-vault-mint' : '']" />
                        </button>
                    </div>
                    <p v-if="copied" class="text-vault-mint text-xs text-center">
                        <Check class="size-3.5 inline mr-1" /> Copied
                    </p>
                </div>
            </div>
        </div>

        <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary/40 px-4 py-3">
                <div>
                    <p class="text-foreground text-sm font-medium">
                        You're depositing
                    </p>
                    <p class="text-vault-ink-dim text-xs">
                        {{ amount ? `${amount} ${chain.symbol}` : 'No amount entered' }}
                    </p>
                </div>
                <div class="text-right">
                    <p class="text-foreground text-sm font-medium">
                        {{ chain.symbol }}
                    </p>
                    <p class="text-vault-ink-dim text-xs">
                        Network: {{ currentNetwork.network }}
                    </p>
                </div>
            </div>

            <button
                type="button"
                @click="deposit"
                :disabled="processing || deposited"
                class="w-full rounded-xl border px-4 py-3 text-sm font-semibold transition-colors"
                :class="[
                    deposited
                        ? 'border-vault-mint/30 bg-vault-mint/10 text-vault-mint cursor-default'
                        : processing
                            ? 'border-border bg-secondary text-vault-ink-dim cursor-not-allowed'
                            : 'border-vault-mint/30 bg-vault-mint text-primary-foreground hover:bg-vault-mint/90',
                ]"
            >
                <template v-if="deposited">
                    <Check class="size-4 inline mr-1" /> Deposited
                </template>
                <template v-else-if="processing">
                    <Loader2 class="size-4 inline mr-1 animate-spin" /> Processing...
                </template>
                <template v-else>
                    <ArrowDown class="size-4 inline mr-1" />
                    Deposit
                    <ArrowRight class="size-4 inline ml-1" />
                </template>
            </button>

            <div v-if="deposited" class="text-vault-ink-dim text-xs text-center">
                Your deposit has been initiated. Funds will appear in your wallet
                once confirmed on-chain.
            </div>
        </div>
    </div>
</template>
