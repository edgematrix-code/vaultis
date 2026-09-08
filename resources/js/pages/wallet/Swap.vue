<script setup lang="ts">
import { Head } from '@/lib/inertia-shim';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Wallet', href: '/wallet' },
            { title: 'Swap', href: '/wallet/swap' },
        ],
    },
});
</script>

<template>
    <Head title="Swap" />

    <div class="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 p-4 md:p-6">
        <div>
            <h1 class="text-foreground text-xl font-semibold tracking-tight">
                Swap
            </h1>
            <p class="text-vault-ink-dim mt-1 text-sm">
                Exchange one asset for another across chains.
            </p>
        </div>

        <div class="border-border bg-card flex flex-col items-center gap-4 rounded-2xl border p-8 text-center">
            <img
                src="/coin_swap_transparent.png"
                alt="Swap"
                class="size-16 object-contain"
            />
            <p class="text-vault-ink-dim text-sm">
                Swap feature coming soon.
            </p>
        </div>
    </div>
</template>
