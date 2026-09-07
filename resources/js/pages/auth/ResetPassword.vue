<script setup lang="ts">
import { ref } from 'vue';
import { Head } from '@/lib/inertia-shim';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useForm } from '@/lib/form';
import { update } from '@/routes/password';

defineProps<{
    token: string;
    email: string;
    passwordRules: string;
}>();

const resetForm = useForm({
    email: '',
    password: '',
    password_confirmation: '',
});

const inputEmail = ref(props.email);

const submitReset = async () => {
    resetForm.post('/reset-password', {
        onSuccess: () => {
            // In standalone mode, we redirect to login on success.
            window.location.href = '/login?reset=success';
        },
    });
};
</script>

<template>
    <div>
        <Head title="Reset password" />

        <form
            @submit.prevent="submitReset"
            class="space-y-6"
        >
            <div class="grid gap-6">
                <div class="grid gap-2">
                    <Label for="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        autocomplete="email"
                        v-model="inputEmail"
                        class="mt-1 block w-full"
                        readonly
                    />
                    <InputError :message="resetForm.errors.email" class="mt-2" />
                </div>

                <div class="grid gap-2">
                    <Label for="password">Password</Label>
                    <PasswordInput
                        id="password"
                        name="password"
                        autocomplete="new-password"
                        class="mt-1 block w-full"
                        autofocus
                        placeholder="Password"
                        :passwordrules="passwordRules"
                        v-model="resetForm.data.password"
                    />
                    <InputError :message="resetForm.errors.password" />
                </div>

                <div class="grid gap-2">
                    <Label for="password_confirmation"> Confirm password </Label>
                    <PasswordInput
                        id="password_confirmation"
                        name="password_confirmation"
                        autocomplete="new-password"
                        class="mt-1 block w-full"
                        placeholder="Confirm password"
                        :passwordrules="passwordRules"
                        v-model="resetForm.data.password_confirmation"
                    />
                    <InputError :message="resetForm.errors.password_confirmation" />
                </div>

                <Button
                    type="submit"
                    class="mt-4 w-full"
                    :disabled="resetForm.processing"
                    data-test="reset-password-button"
                >
                    <Spinner v-if="resetForm.processing" />
                    Reset password
                </Button>
            </div>
        </form>
    </div>
</template>
