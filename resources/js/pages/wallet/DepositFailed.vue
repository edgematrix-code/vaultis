<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Head } from '@/lib/inertia-shim';
import { router } from '@/lib/inertia-shim';
import { AlertTriangle, Loader2 } from '@lucide/vue';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Wallet', href: '/wallet' },
            { title: 'Upgrade', href: '/wallet/upgrade' },
            { title: 'Deposit', href: '/wallet/upgrade/deposit' },
            { title: 'Deposit result', href: '/wallet/upgrade/deposit-failed' },
        ],
    },
});

const okLoading = ref(false);
const showResult = ref(false);

// Show the processing spinner first, then reveal the failure message
onMounted(() => {
    setTimeout(() => {
        showResult.value = true;
    }, 3000);
});

function handleOk() {
    okLoading.value = true;
    setTimeout(() => {
        okLoading.value = false;
        router.visit('/wallet/upgrade');
    }, 500);
}
</script>

<template>
    <Head title="Deposit failed" />

    <div class="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <div class="flex flex-col items-center gap-4">
            <!-- Vaultis processing logo (always visible) -->
            <div class="flex flex-col items-center gap-3">
                <img
                    src="/brand/vaultis-mark.png"
                    alt="Vaultis"
                    class="size-20 object-contain"
                />
                <Loader2
                    class="size-8 text-vault-mint animate-spin"
                />
            </div>

            <!-- Status message (appears after processing) -->
            <Transition
                enter-active-class="transition duration-500 ease-out"
                enter-from-class="opacity-0 translate-y-4"
                enter-to-class="opacity-100 translate-y-0"
            >
                <div
                    v-if="showResult"
                    class="flex flex-col items-center gap-2 text-center max-w-sm"
                >
                    <p class="text-foreground text-lg font-semibold">
                        Deposit not successful
                    </p>
                    <p class="text-vault-ink-dim text-sm">
                        No token was sent to the deposit address.
                    </p>
                </div>
            </Transition>

            <!-- Warning banner (appears after processing) -->
            <Transition
                enter-active-class="transition duration-500 ease-out"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
            >
                <div
                    v-if="showResult"
                    class="w-full flex items-start gap-3 rounded-xl border border-vault-rose/30 bg-vault-rose/5 p-4 text-xs"
                >
                    <AlertTriangle class="mt-0.5 size-4 shrink-0 text-vault-rose" />
                    <div>
                        <p class="text-vault-rose/90 font-semibold">
                            Warning
                        </p>
                        <p class="mt-1 text-vault-rose/70">
                            Your account would be locked after
                            <strong class="text-vault-rose">2 more failed
                                attempts</strong>.
                            Please make sure you send the tokens before trying
                            again.
                        </p>
                    </div>
                </div>
            </Transition>
        </div>

        <!-- OK button (appears after processing) -->
        <Transition
            enter-active-class="transition duration-500 ease-out"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
        >
            <button
                v-if="showResult"
                type="button"
                @click="handleOk"
                :disabled="okLoading"
                class="w-full rounded-xl border px-4 py-3 text-sm font-semibold transition-colors"
                :class="[
                    okLoading
                        ? 'border-border bg-secondary text-vault-ink-dim cursor-not-allowed'
                        : 'border-vault-mint/30 bg-vault-mint text-primary-foreground hover:bg-vault-mint/90',
                ]"
            >
                <template v-if="okLoading">
                    <Loader2 class="size-4 inline mr-2 animate-spin" />
                    Redirecting…
                </template>
                <template v-else>
                    OK
                </template>
            </button>
        </Transition>
    </div>
</template>
