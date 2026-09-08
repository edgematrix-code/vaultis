<script setup lang="ts">
import { Link } from '@/lib/inertia-shim';
</script>

<template>
    <div
        class="border-border bg-card flex flex-col justify-between gap-4 rounded-2xl border p-6"
    >
        <p class="text-vault-ink-dim text-sm">Quick actions</p>

        <div class="grid grid-cols-1 gap-2.5">
            <Link
                href="/wallet/deposit"
                class="brand-label bg-vault-mint text-primary-foreground flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-transform hover:translate-x-0.5"
            >
                Deposit
                <img
                    src="/growth_transparent.png"
                    alt="Deposit"
                    class="size-16 object-contain sm:size-12"
                />
            </Link>
            <Link
                href="/wallet/withdraw"
                class="brand-label border-border bg-secondary text-secondary-foreground flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-transform hover:translate-x-0.5"
            >
                Transfer
                <img
                    src="/wallet_transparent.png"
                    alt="Transfer"
                    class="size-16 object-contain sm:size-12"
                />
            </Link>
            <Link
                href="/wallet/receive"
                class="brand-label border-border text-foreground flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-transform hover:translate-x-0.5"
            >
                Receive
                <img
                    src="/analytics_transparent.png"
                    alt="Receive"
                    class="size-16 object-contain sm:size-12"
                />
            </Link>
            <Link
                href="/wallet/swap"
                class="brand-label border-border bg-vault-forest/10 text-vault-forest flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-transform hover:translate-x-0.5"
            >
                Swap
                <img
                    src="/coin_swap_transparent.png"
                    alt="Swap"
                    class="size-16 object-contain sm:size-12"
                />
            </Link>
        </div>
    </div>
</template>
