<script setup lang="ts">
import { useForm } from '@/lib/form';
import { RouterLink as Link } from 'vue-router';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { send } from '@/routes/verification';

defineProps<{
    status?: string;
}>();

const verifyForm = useForm({});

const resendVerification = async () => {
    await verifyForm.post('/email/verification-notification', {
        onSuccess: () => {
            // Stay on the same page after successful resend.
        },
    });
};

const logoutHandler = () => {
    window.location.href = login.url();
};
</script>

<template>
    <div>
        <Head title="Email verification" />

        <div
            v-if="status === 'verification-link-sent'"
            class="mb-4 text-center text-sm font-medium text-green-600"
        >
            A new verification link has been sent to the email address you provided
            during registration.
        </div>

        <form
            @submit.prevent="resendVerification"
            class="space-y-6 text-center"
        >
            <Button :disabled="verifyForm.processing" variant="secondary">
                <Spinner v-if="verifyForm.processing" />
                Resend verification email
            </Button>

            <TextLink
                :href="login.url()"
                as="button"
                class="mx-auto block text-sm"
                @click="logoutHandler"
            >
                Log out
            </TextLink>
        </form>
    </div>
</template>
