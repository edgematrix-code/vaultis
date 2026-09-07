<script setup lang="ts">
import { useForm } from '@/lib/form';
import { RouterLink as Link } from 'vue-router';
import InputError from '@/components/InputError.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { email } from '@/routes/password';

defineProps<{
    status?: string;
}>();

const forgotForm = useForm({ email: '' });
</script>

<template>
    <div>
        <Head title="Forgot password" />

        <div
            v-if="status"
            class="mb-4 text-center text-sm font-medium text-green-600"
        >
            {{ status }}
        </div>

        <div class="space-y-6">
            <form
                @submit.prevent="forgotForm.post('/forgot-password', {})"
                class="space-y-6"
            >
                <div class="grid gap-2">
                    <Label for="email">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        autocomplete="off"
                        autofocus
                        placeholder="email@example.com"
                        v-model="forgotForm.data.email"
                    />
                    <InputError :message="forgotForm.errors.email" />
                </div>

                <div class="my-6 flex items-center justify-start">
                    <Button
                        class="w-full"
                        :disabled="forgotForm.processing"
                        data-test="email-password-reset-link-button"
                    >
                        <Spinner v-if="forgotForm.processing" />
                        Email password reset link
                    </Button>
                </div>
            </form>

            <div class="text-muted-foreground space-x-1 text-center text-sm">
                <span>Or, return to</span>
                <TextLink :href="login.url()">log in</TextLink>
            </div>
        </div>
    </div>
</template>
