<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ShieldCheck, Cookie } from '@lucide/vue';

const isOpen = ref(false);
const accepted = ref(false);
const necessaryOnly = ref(false);

const COOKIE_NAME = 'vaultis_cookie_consent';
const COOKIE_DAYS = 365;

function setCookie(name: string, value: string, days: number) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value};path=/;expires=${expires};SameSite=Lax`;
}

function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
}

function saveConsent() {
    const consent = accepted.value
        ? (necessaryOnly.value ? 'necessary' : 'all')
        : 'declined';
    setCookie(COOKIE_NAME, consent, COOKIE_DAYS);
    isOpen.value = false;
}

function handleAccept() {
    accepted.value = true;
    saveConsent();
}

function handleDecline() {
    accepted.value = false;
    saveConsent();
}

onMounted(() => {
    if (typeof document === 'undefined') return;

    const existingConsent = getCookie(COOKIE_NAME);
    if (existingConsent === 'all' || existingConsent === 'necessary' || existingConsent === 'declined') {
        return;
    }

    isOpen.value = true;
});
</script>

<template>
    <Dialog :open="isOpen" @update:open="isOpen = $event">
        <DialogContent class="sm:max-w-md border-border bg-card">
            <DialogHeader class="flex items-start gap-3">
                <div
                    class="flex size-10 shrink-0 items-center justify-center rounded-full bg-vault-mint/10"
                >
                    <Cookie class="size-5 text-vault-mint" />
                </div>
                <div class="flex-1">
                    <DialogTitle class="text-base">
                        We value your privacy
                    </DialogTitle>
                    <DialogDescription class="mt-1 text-sm">
                        We use cookies to enhance your browsing experience, serve
                        personalized content, and analyze our traffic. You can
                        choose to accept all cookies or only necessary ones.
                    </DialogDescription>
                </div>
            </DialogHeader>

            <div class="mt-4 space-y-3">
                <div
                    class="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3"
                >
                    <ShieldCheck class="size-4 shrink-0 text-vault-mint mt-0.5" />
                    <div class="text-sm">
                        <p class="font-medium text-foreground">
                            Necessary cookies
                        </p>
                        <p class="text-vault-ink-dim text-xs mt-0.5">
                            Required for the website to function properly.
                        </p>
                    </div>
                </div>

                <div
                    class="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3"
                >
                    <Cookie class="size-4 shrink-0 text-vault-ink-dim mt-0.5" />
                    <div class="text-sm">
                        <p class="font-medium text-foreground">
                            Analytics &amp; personalization
                        </p>
                        <p class="text-vault-ink-dim text-xs mt-0.5">
                            Help us improve the site and tailor content to your
                            preferences.
                        </p>
                    </div>
                </div>
            </div>

            <DialogFooter class="mt-5 flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" class="w-full sm:w-auto" @click="handleDecline">
                    Decline
                </Button>
                <div class="flex items-center gap-2">
                    <Checkbox
                        :checked="!necessaryOnly"
                        class="size-4"
                        @update:checked="(val: boolean) => (necessaryOnly = !val)"
                    />
                    <Button @click="handleAccept">
                        {{ necessaryOnly ? 'Accept necessary only' : 'Accept all' }}
                    </Button>
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
