<script setup lang="ts">
import { computed, ref } from 'vue';
import { Head, usePage } from '@/lib/inertia-shim';
import { Check, Loader2 } from '@lucide/vue';
import { router } from '@/lib/inertia-shim';
import ChainGlyph from '@/components/wallet/ChainGlyph.vue';
import { CHAINS } from '@/lib/wallet-data';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Wallet', href: '/wallet' },
            { title: 'Upgrade', href: '/wallet/upgrade' },
        ],
    },
});

const page = usePage();
const user = computed(() => page.props.auth?.user);

const processing = ref(false);

const selectedTier = ref<1 | 2>(1);

function selectTier(id: 1 | 2) {
    selectedTier.value = id;
}

function startFundFlow() {
    processing.value = true;
    setTimeout(() => {
        processing.value = false;
        router.visit('/wallet/upgrade/fund');
    }, 500);
}
</script>

<template>
    <Head title="Upgrade" />

    <div class="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <!-- Intro -->
        <div>
            <h1 class="text-foreground text-xl font-semibold tracking-tight">
                Upgrade your account
            </h1>
            <p class="text-vault-ink-dim mt-1 max-w-lg text-sm">
                Upgrade your account to increase your transaction limits, unlock
                higher withdrawal caps, and access premium features across all
                supported chains.
            </p>
        </div>

        <!-- Tier cards -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <!-- ═══ Tier 1 — Verified ═══ -->
            <div
                :class="[
                    'relative border-border rounded-2xl border p-5 transition-all',
                    selectedTier === 1
                        ? 'ring-2 ring-vault-mint ring-offset-2'
                        : 'bg-card hover:border-vault-mint/20',
                ]"
            >
                <!-- Header -->
                <div class="mb-4 flex items-center justify-between">
                    <span class="text-foreground text-sm font-semibold">
                        Tier 1
                    </span>
                    <span
                        class="flex items-center gap-1 text-vault-mint text-xs font-medium"
                    >
                        <Check class="size-3.5" />
                        Verified
                    </span>
                </div>

                <!-- Verified badge with user photo + ID doc -->
                <div class="flex items-center gap-4 rounded-xl border border-border bg-secondary/40 p-3">
                    <!-- User avatar (Beverly Myles photo — replaces Vaultis logo) -->
                    <img
                        v-if="user?.avatar"
                        :src="user.avatar"
                        :alt="user.name"
                        class="size-14 rounded-full object-cover border-2 border-vault-mint/40"
                    />
                    <img
                        v-else
                        src="/BeverlyMyles.png"
                        alt="User photo"
                        class="size-14 rounded-full object-cover border-2 border-vault-mint/40"
                    />
                    <!-- ID document icon -->
                    <div class="flex flex-col items-start gap-1">
                        <!-- Beverly Myles — full name above ID doc text -->
                        <span class="text-foreground text-sm font-bold">
                            {{ user?.name || 'Beverly Myles' }}
                        </span>
                        <div class="flex items-center gap-2">
                            <svg
                                class="size-5 text-vault-mint"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                            <span class="text-vault-ink-dim text-xs">Identity document verified</span>
                        </div>
                    </div>
                </div>

                <p class="mt-3 text-vault-ink-dim text-xs">
                    Your identity has been verified. You can withdraw up to
                    higher limits on supported chains.
                </p>

                <div class="mt-4 flex items-center gap-2 text-vault-mint text-xs font-medium">
                    <Check class="size-3.5" />
                    Selected
                </div>
            </div>

            <!-- ═══ Tier 2 — Not verified ═══ -->
            <div
                :class="[
                    'relative border-border rounded-2xl border p-5 transition-all',
                    selectedTier === 2
                        ? 'ring-2 ring-vault-mint ring-offset-2'
                        : 'bg-card hover:border-vault-mint/20',
                ]"
            >
                <!-- Header -->
                <div class="mb-4 flex items-center justify-between">
                    <span class="text-foreground text-sm font-semibold">
                        Tier 2
                    </span>
                    <span
                        class="flex items-center gap-1 text-vault-rose text-xs font-medium"
                    >
                        <svg
                            class="size-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        Not verified
                    </span>
                </div>

                <p class="text-vault-ink-dim text-xs mb-4">
                    Unlock unlimited withdrawal limits, priority 24/7 support,
                    custom fee settings, and multiple addresses per chain.
                </p>

                <button
                    type="button"
                    @click="startFundFlow"
                    :disabled="processing"
                    class="w-full rounded-xl border px-4 py-3 text-sm font-semibold transition-colors"
                    :class="[
                        processing
                            ? 'border-border bg-secondary text-vault-ink-dim cursor-not-allowed'
                            : 'border-vault-mint/30 bg-vault-mint text-primary-foreground hover:bg-vault-mint/90',
                    ]"
                >
                    <template v-if="processing">
                        <Loader2 class="size-4 inline mr-2 animate-spin" />
                        Redirecting…
                    </template>
                    <template v-else>
                        Upgrade to Tier 2
                    </template>
                </button>
            </div>
        </div>
    </div>
</template>
