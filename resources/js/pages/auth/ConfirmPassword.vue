<script setup lang="ts">
import { Head } from '@/lib/inertia-shim';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useForm } from '@/lib/form';
import { store as confirmStore } from '@/routes/password/confirm';
/* @chisel-passkeys */
import PasskeyVerify from '@/components/PasskeyVerify.vue';
/* @end-chisel-passkeys */

defineProps<{
    passwordRules?: string;
}>();

const confirmForm = useForm({ password: '' });

const submitConfirm = async () => {
    confirmForm.post('/user/confirm-password', {
        onSuccess: () => {
            // In standalone mode, redirect to dashboard after confirmation.
            window.location.href = '/dashboard';
        },
    });
};
</script>

<template>
    <div>
        <Head title="Confirm password" />

        <!-- @chisel-passkeys -->
        <PasskeyVerify
            :routes="{
                options: confirmStore.url(),
                submit: confirmStore.form(),
            }"
            label="Confirm with passkey"
            loading-label="Confirming..."
            separator="Or confirm with password"
        />
        <!-- @end-chisel-passkeys -->

        <form
            @submit.prevent="submitConfirm"
            class="space-y-6"
        >
            <div class="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                    id="password"
                    v-model="confirmForm.data.password"
                    name="password"
                    class="mt-1 block w-full"
                    required
                    autocomplete="current-password"
                    autofocus
                />

                <InputError :message="confirmForm.errors.password" />
            </div>

            <div class="flex items-center">
                <Button
                    class="w-full"
                    :disabled="confirmForm.processing"
                    data-test="confirm-password-button"
                >
                    <Spinner v-if="confirmForm.processing" />
                    Confirm password
                </Button>
            </div>
        </form>
    </div>
</template>
