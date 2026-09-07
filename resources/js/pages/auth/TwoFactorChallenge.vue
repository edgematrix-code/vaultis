<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Head } from '@/lib/inertia-shim';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { useForm } from '@/lib/form';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { store } from '@/routes/two-factor/login';
import type { TwoFactorConfigContent } from '@/types';

const showRecoveryInput = ref<boolean>(false);
const otpCode = ref<string>('');
const recoveryCode = ref<string>('');

const twoFactorForm = useForm({
    code: '',
    recovery_code: '',
});

const authConfigContent = computed<TwoFactorConfigContent>(() => {
    if (showRecoveryInput.value) {
        return {
            title: 'Recovery code',
            description:
                'Please confirm access to your account by entering one of your emergency recovery codes.',
            buttonText: 'login using an authentication code',
        };
    }

    return {
        title: 'Authentication code',
        description:
            'Enter the authentication code provided by your authenticator application.',
        buttonText: 'login using a recovery code',
    };
});

const toggleRecoveryMode = (clearErrors: () => void): void => {
    showRecoveryInput.value = !showRecoveryInput.value;
    clearErrors();
    otpCode.value = '';
};

const submit2FACode = async () => {
    if (showRecoveryInput.value) {
        twoFactorForm.post('/two-factor-challenge', {
            onError: () => {
                // errors populated into twoFactorForm.errors
            },
        });
    } else {
        twoFactorForm.patch('/two-factor-challenge', { code: otpCode.value });
    }
};
</script>

<template>
    <div>
        <Head title="Two-factor authentication" />

        <div class="space-y-6">
            <template v-if="!showRecoveryInput">
                <form
                    @submit.prevent="submit2FACode"
                    class="space-y-4"
                >
                    <div
                        class="flex flex-col items-center justify-center space-y-3 text-center"
                    >
                        <div class="flex w-full items-center justify-center">
                            <InputOTP
                                id="otp"
                                v-model="otpCode"
                                :maxlength="6"
                                :disabled="twoFactorForm.processing"
                                autofocus
                                @complete="submit2FACode"
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot
                                        v-for="index in 6"
                                        :key="index"
                                        :index="index - 1"
                                    />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                        <InputError :message="twoFactorForm.errors.code" />
                    </div>
                    <Button type="submit" class="w-full" :disabled="twoFactorForm.processing"
                        >Continue</Button
                    >
                    <div class="text-muted-foreground text-center text-sm">
                        <span>or you can </span>
                        <button
                            type="button"
                            class="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                            @click="() => toggleRecoveryMode(() => twoFactorForm.clearErrors())"
                        >
                            {{ authConfigContent.buttonText }}
                        </button>
                    </div>
                </form>
            </template>

            <template v-else>
                <form
                    @submit.prevent="submit2FACode"
                    class="space-y-4"
                >
                    <Input
                        name="recovery_code"
                        type="text"
                        placeholder="Enter recovery code"
                        :autofocus="showRecoveryInput"
                        required
                        v-model="recoveryCode"
                    />
                    <InputError :message="twoFactorForm.errors.recovery_code" />
                    <Button type="submit" class="w-full" :disabled="twoFactorForm.processing"
                        >Continue</Button
                    >

                    <div class="text-muted-foreground text-center text-sm">
                        <span>or you can </span>
                        <button
                            type="button"
                            class="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                            @click="() => toggleRecoveryMode(() => twoFactorForm.clearErrors())"
                        >
                            {{ authConfigContent.buttonText }}
                        </button>
                    </div>
                </form>
            </template>
        </div>
    </div>
</template>
