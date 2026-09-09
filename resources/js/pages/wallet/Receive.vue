<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Head } from '@/lib/inertia-shim';
import ChainGlyph from '@/components/wallet/ChainGlyph.vue';
import ChainSelect from '@/components/wallet/ChainSelect.vue';
import QRAddress from '@/components/wallet/QRAddress.vue';
import { CHAINS, TOKEN_NETWORKS, TOKEN_ADDRESSES, getTokenNetworks } from '@/lib/wallet-data';
import type { ChainId } from '@/types/wallet';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Wallet', href: '/wallet' },
            { title: 'Receive', href: '/wallet/receive' },
        ],
    },
});

const props = defineProps<{
    balances?: AssetBalance[];
}>();

const balances = ref<AssetBalance[]>(props.balances ?? []);

const params = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : '',
);
const initialToken = (params.get('token') as ChainId) || 'btc';

// Step 1: Select token/asset (what you're receiving)
const selectedToken = ref<ChainId>(initialToken);

// Step 2: Select network for that token (where to receive it)
const selectedNetwork = ref<ChainId>(TOKEN_NETWORKS[initialToken][0]);

// Reset network when token changes (pick first available network for new token)
watch(
    selectedToken,
    (token) => {
        selectedNetwork.value = TOKEN_NETWORKS[token][0];
    },
    { immediate: true },
);

// Get the balance for the selected token (not network — address is per token+network)
const tokenBalance = computed(
    () => balances.value.find((b) => b.chain === selectedToken.value),
);

// Get chain info for the selected token
const tokenInfo = computed(() => CHAINS[selectedToken.value]);

// Get chain info for the selected network
const networkInfo = computed(() => CHAINS[selectedNetwork.value]);

// Available networks for the selected token
const availableNetworks = computed(() => getTokenNetworks(selectedToken.value));

// Get the receive address for the selected token + network
const receiveAddress = computed(
    () => TOKEN_ADDRESSES[selectedToken.value]?.[selectedNetwork.value] ?? '',
);
</script>

<template>
    <Head title="Receive" />

    <div class="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <div>
            <h1 class="text-foreground text-xl font-semibold tracking-tight">
                Receive
            </h1>
            <p class="text-vault-ink-dim mt-1 max-w-md text-sm">
                Choose which asset you're receiving, then select the network.
            </p>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            <!-- Left: Token & Network Selection -->
            <div class="flex flex-col gap-6">
                <!-- Token Selection -->
                <div class="border-border bg-card rounded-2xl border p-6">
                    <p class="text-foreground mb-4 text-sm font-medium">
                        Select an asset
                    </p>
                    <ChainSelect v-model="selectedToken" />
                </div>

                <!-- Network Selection -->
                <div class="border-border bg-card rounded-2xl border p-6">
                    <p class="text-foreground mb-4 text-sm font-medium">
                        Select network
                    </p>
                    <div class="flex flex-wrap gap-2">
                        <button
                            v-for="network in availableNetworks"
                            :key="network.id"
                            type="button"
                            @click="selectedNetwork = network.id"
                            :class="[
                                'flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors',
                                selectedNetwork === network.id
                                    ? 'border-vault-mint/50 bg-vault-mint/10'
                                    : 'border-border hover:border-vault-mint/30 hover:bg-secondary/60',
                            ]"
                        >
                            <ChainGlyph :chain="network.id" size="sm" />
                            <span class="min-w-0">
                                <span class="text-foreground block truncate text-sm font-medium">
                                    {{ network.symbol }}
                                </span>
                                <span class="text-vault-ink-dim block truncate text-[11px]">
                                    {{ network.network }}
                                </span>
                            </span>
                        </button>
                    </div>

                    <!-- Network-specific warning for multi-network tokens -->
                    <div v-if="availableNetworks.length > 1" class="mt-4 rounded-xl bg-vault-amber/10 border border-vault-amber/20 p-3">
                        <p class="text-vault-amber text-xs font-medium">
                            ⚠️ Network selection matters
                        </p>
                        <p class="text-vault-ink-dim mt-1 text-xs">
                            Make sure the sender uses the same network you select below.
                            Sending {{ tokenInfo.symbol }} on the wrong network may result in permanent loss.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Right: QR Code & Address -->
            <div
                class="border-border bg-secondary/40 flex flex-col justify-between gap-6 rounded-2xl border p-6"
            >
                <div>
                    <p class="text-foreground text-sm font-medium">
                        {{ tokenInfo.symbol }} on {{ networkInfo.network }}
                    </p>
                    <p class="text-vault-ink-dim mt-1 text-xs">
                        Share this address to receive {{ tokenInfo.symbol }}
                    </p>
                </div>

                <div class="mt-4 flex flex-col items-center">
                    <QRAddress :chain="selectedNetwork" :address="receiveAddress" />
                    <p class="mt-3 text-vault-ink-dim text-xs">
                        Scan this QR code to receive {{ tokenInfo.symbol }} on {{ networkInfo.network }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
