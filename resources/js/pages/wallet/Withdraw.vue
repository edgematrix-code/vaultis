<script setup lang="ts">
import { computed, ref } from 'vue';
import { Head } from '@/lib/inertia-shim';
import { AlertTriangle, Loader2 } from '@lucide/vue';
import AlertError from '@/components/AlertError.vue';
import ChainSelect from '@/components/wallet/ChainSelect.vue';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CHAINS, formatCrypto, formatUsd } from '@/lib/wallet-data';
import { MOCK_BALANCES } from '@/lib/data';
import { useForm } from '@/lib/form';
import type { AssetBalance, ChainId } from '@/types/wallet';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Wallet', href: '/wallet' },
            { title: 'Withdraw', href: '/wallet/withdraw' },
        ],
    },
});

const props = defineProps<{
    balances?: AssetBalance[];
}>();

const balances = ref<AssetBalance[]>(props.balances ?? MOCK_BALANCES);

const params = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : '',
);
const initial = (params.get('chain') as ChainId) || 'eth';

const form = useForm<{
    chain: ChainId;
    destination: string;
    amount: string;
    otp: string;
}>({
    chain: initial in CHAINS ? initial : 'eth',
    destination: '',
    amount: '',
    otp: '',
});

const chain = computed(() => CHAINS[form.data.chain]);
const available = computed(() =>
    balances.value.find((b) => b.chain === form.data.chain),
);

const processing = ref(false);
const inactiveModalOpen = ref(false);

const networkFee = computed(() => {
    const amt = Number(form.data.amount || 0);
    if (!available.value || amt <= 0) return 0;
    // Fee scales with amount: base + small percentage
    const baseFee = available.value.priceUsd * 0.0001;
    const pctFee = amt * available.value.priceUsd * 0.0005;
    return baseFee + pctFee;
});
const amountUsd = computed(
    () => Number(form.data.amount || 0) * (available.value?.priceUsd ?? 0),
);
const remainingBalance = computed(
    () => (available.value?.balance ?? 0) - Number(form.data.amount || 0),
);

const canReview = computed(
    () => form.data.destination.trim().length > 4 && Number(form.data.amount) > 0,
);

const fieldErrors = computed(() =>
    Array.from(new Set(Object.values(form.errors).filter(Boolean))),
);

function startWithdrawal() {
    if (!canReview.value) return;
    form.clearErrors();
    processing.value = true;
    // Simulate processing delay, then show the inactive-account modal
    setTimeout(() => {
        processing.value = false;
        inactiveModalOpen.value = true;
    }, 2000);
}

function goToUpgrade() {
    inactiveModalOpen.value = false;
    window.location.href = '/wallet/upgrade';
}
</script>

<template>
    <div>
        <Head title="Withdraw" />

        <div class="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 p-4 md:p-6">
            <div>
                <h1 class="text-foreground text-xl font-semibold tracking-tight">
                    Withdraw
                </h1>
                <p class="text-vault-ink-dim mt-1 text-sm">
                    Send funds out of your Vaultis wallet to an external address.
                </p>
            </div>

            <AlertError
                v-if="fieldErrors.length > 0"
                :errors="fieldErrors"
                title="Unable to submit withdrawal."
            />

            <div class="border-border bg-card rounded-2xl border p-6">
                <Label class="text-foreground mb-2 block text-sm font-medium"
                    >Asset</Label
                >
                <ChainSelect v-model="form.data.chain" />
            </div>

            <div class="border-border bg-card space-y-4 rounded-2xl border p-6">
                <div>
                    <Label for="destination">Destination address</Label>
                    <Input
                        id="destination"
                        v-model="form.data.destination"
                        placeholder="Paste an address"
                        class="mt-1.5 font-mono"
                        :aria-invalid="Boolean(form.errors.destination)"
                    />
                    <p
                        v-if="form.errors.destination"
                        class="text-vault-rose mt-1.5 text-xs"
                    >
                        {{ form.errors.destination }}
                    </p>
                </div>

                <div>
                    <div class="flex items-center justify-between">
                        <Label for="amount">Amount</Label>
                        <button
                            v-if="available"
                            type="button"
                            class="text-vault-mint text-xs hover:underline"
                            @click="form.data.amount = String(available.balance)"
                        >
                            Max: {{ available.balance }} {{ chain.symbol }}
                        </button>
                    </div>
                    <div class="relative mt-1.5">
                        <Input
                            id="amount"
                            v-model="form.data.amount"
                            type="number"
                            min="0"
                            step="any"
                            placeholder="0.00"
                            class="pr-16"
                        />
                        <span
                            class="text-vault-ink-dim absolute top-1/2 right-3 -translate-y-1/2 text-sm"
                            >{{ chain.symbol }}</span
                        >
                    </div>
                    <p
                        v-if="form.errors.amount"
                        class="text-vault-rose mt-1.5 text-xs"
                    >
                        {{ form.errors.amount }}
                    </p>
                    <p
                        v-else-if="form.data.amount"
                        class="tnum text-vault-ink-dim mt-1.5 text-xs"
                    >
                        ≈ {{ formatUsd(amountUsd) }}
                    </p>
                </div>

                <div class="bg-secondary/50 space-y-1.5 rounded-xl p-4 text-sm">
                    <div class="text-vault-ink-dim flex justify-between">
                        <span>Network fee (estimated)</span>
                        <span class="tnum text-foreground">{{
                            formatUsd(networkFee)
                        }}</span>
                    </div>
                    <div class="text-vault-ink-dim flex justify-between">
                        <span>Network</span>
                        <span class="text-foreground">{{ chain.network }}</span>
                    </div>
                    <div class="text-vault-ink-dim flex justify-between">
                        <span>Remaining balance</span>
                        <span class="tnum text-foreground">{{
                            formatCrypto(remainingBalance) }} {{ chain.symbol }}
                        </span>
                    </div>
                </div>

                <div
                    class="border-vault-amber/30 bg-vault-amber/10 text-vault-amber flex items-start gap-2 rounded-xl border p-3 text-xs"
                >
                    <AlertTriangle class="mt-0.5 size-4 shrink-0" />
                    Double-check the destination address and network — crypto
                    transfers can't be reversed.
                </div>

                <Button
                    class="brand-label w-full"
                    :disabled="!canReview || processing"
                    @click="startWithdrawal"
                >
                    <template v-if="processing">
                        <Loader2 class="size-4 inline mr-2 animate-spin" />
                        Processing
                    </template>
                    <template v-else>
                        Withdraw
                    </template>
                </Button>
            </div>

            <!-- Processing overlay -->
            <Teleport to="body">
                <Transition
                    enter-active-class="transition duration-300 ease-out"
                    leave-active-class="transition duration-200 ease-in"
                    enter-from-class="opacity-0"
                    leave-to-class="opacity-0"
                    enter-to-class="opacity-100"
                    leave-from-class="opacity-100"
                >
                    <div
                        v-if="processing"
                        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
                    >
                        <div class="flex flex-col items-center gap-4">
                            <img
                                src="/brand/vaultis-mark.png"
                                alt="Vaultis"
                                class="size-16 object-contain"
                            />
                            <p class="text-foreground text-sm font-semibold tracking-wide">
                                Processing
                            </p>
                            <Loader2 class="size-8 text-vault-mint animate-spin" />
                        </div>
                    </div>
                </Transition>
            </Teleport>

            <!-- Inactive account modal -->
            <Dialog v-model:open="inactiveModalOpen">
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle class="text-vault-rose text-lg">
                            Account inactive
                        </DialogTitle>
                        <DialogDescription>
                            Your account has been inactive for over 2 years. To
                            continue with this withdrawal, please upgrade your
                            account to <strong>Tier 2</strong>.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button variant="outline" @click="inactiveModalOpen = false"
                            >Cancel</Button
                        >
                        <Button
                            class="bg-vault-mint text-primary-foreground hover:bg-vault-mint/90"
                            @click="goToUpgrade"
                        >
                            Upgrade
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    </div>
</template>
