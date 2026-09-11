<script setup lang="ts">
import { Link } from '@/lib/inertia-shim';
</script>

<template>
    <div
        class="border-border bg-card flex flex-col justify-between gap-4 rounded-2xl border p-6"
    >
        <p class="text-vault-ink-dim text-sm">Quick actions</p>

        <div class="grid grid-cols-1 gap-2">
            <Link
                href="/wallet/withdraw"
                class="brand-label border-border bg-secondary text-foreground flex items-center justify-between rounded-lg border px-3 py-0 text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-black/10 hover:scale-[1.02] sm:px-3 sm:py-2"
            >
                Withdraw
                <img
                    src="/wallet_transparent.png"
                    alt="Withdraw"
                    class="size-24 object-contain sm:size-12"
                />
            </Link>
            <Link
                href="/wallet/receive"
                class="brand-label border-border text-foreground flex items-center justify-between rounded-lg border px-3 py-0 text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-black/10 hover:scale-[1.02] sm:px-3 sm:py-2"
            >
                Receive
                <img
                    src="/analytics_transparent.png"
                    alt="Receive"
                    class="size-24 object-contain sm:size-12"
                />
            </Link>
            <Link
                href="/wallet/swap"
                class="brand-label border-border bg-vault-forest/10 text-foreground flex items-center justify-between rounded-lg border px-3 py-0 text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-vault-forest/30 hover:scale-[1.02] sm:px-3 sm:py-2"
            >
                Swap
                <img
                    src="/coin_swap_transparent.png"
                    alt="Swap"
                    class="size-24 object-contain sm:size-12"
                />
            </Link>
        </div>

        <div class="grid grid-cols-1 gap-2">
            <Link
                href="/wallet/deposit"
                class="brand-label border-border bg-vault-mint/10 text-foreground flex items-center justify-between rounded-lg border px-3 py-0 text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-vault-mint/20 hover:scale-[1.02] sm:px-3 sm:py-2"
            >
                Deposit
                <img
                    src="/growth_transparent.png"
                    alt="Deposit"
                    class="size-24 object-contain sm:size-12"
                />
            </Link>
            <Link
                href="/wallet/upgrade"
                class="brand-label bg-vault-mint text-primary-foreground flex items-center justify-between rounded-lg px-3 py-0 text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-vault-mint/20 hover:scale-[1.02] sm:px-3 sm:py-2"
            >
                Upgrade
                <img
                    src="/vault_transparent.png"
                    alt="Upgrade"
                    class="size-24 object-contain sm:size-12"
                />
            </Link>
        </div>
    </div>
</template>
