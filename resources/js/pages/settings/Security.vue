<script setup lang="ts">
import { Head } from '@/lib/inertia-shim';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import Heading from '@/components/Heading.vue';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/security';
import { useForm } from '@/lib/form';

// oxfmt-ignore
defineProps<{
    passwordRules: string;
}>();

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Security settings',
                href: edit.url(),
            },
        ],
    },
});

const securityForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
});

const updatePassword = async () => {
    securityForm.put('/settings/password', {
        current_password: securityForm.data.current_password,
        password: securityForm.data.password,
        password_confirmation: securityForm.data.password_confirmation,
    });
};
</script>

<template>
    <div>
        <Head title="Security settings" />

        <h1 class="sr-only">Security settings</h1>

        <div class="space-y-6">
            <Heading
                variant="small"
                title="Update password"
                description="Ensure your account is using a long, random password to stay secure"
            />

            <form
                @submit.prevent="updatePassword"
                class="space-y-6"
            >
                <div class="grid gap-2">
                    <Label for="current_password">Current password</Label>
                    <PasswordInput
                        id="current_password"
                        v-model="securityForm.data.current_password"
                        name="current_password"
                        class="mt-1 block w-full"
                        autocomplete="current-password"
                        placeholder="Current password"
                    />
                    <InputError :message="securityForm.errors.current_password" />
                </div>

                <div class="grid gap-2">
                    <Label for="password">New password</Label>
                    <PasswordInput
                        id="password"
                        v-model="securityForm.data.password"
                        name="password"
                        class="mt-1 block w-full"
                        autocomplete="new-password"
                        placeholder="New password"
                        :passwordrules="passwordRules"
                    />
                    <InputError :message="securityForm.errors.password" />
                </div>

                <div class="grid gap-2">
                    <Label for="password_confirmation">Confirm password</Label>
                    <PasswordInput
                        id="password_confirmation"
                        v-model="securityForm.data.password_confirmation"
                        name="password_confirmation"
                        class="mt-1 block w-full"
                        autocomplete="new-password"
                        placeholder="Confirm password"
                        :passwordrules="passwordRules"
                    />
                    <InputError :message="securityForm.errors.password_confirmation" />
                </div>

                <div class="flex items-center gap-4">
                    <Button
                        :disabled="securityForm.processing"
                        data-test="update-password-button"
                    >
                        Save
                    </Button>
                </div>
            </form>
        </div>
    </div>
</template>
