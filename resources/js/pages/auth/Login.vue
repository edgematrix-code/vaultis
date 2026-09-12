<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink as Link, useRouter } from 'vue-router';
import { Mail, ScrollText } from '@lucide/vue';
import InputError from '@/components/InputError.vue';
import PasskeyVerify from '@/components/PasskeyVerify.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthSplitLayout from '@/layouts/auth/AuthSplitLayout.vue';
import { useForm } from '@/lib/form';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { register } from '@/routes';

defineProps<{
    status?: string;
    canResetPassword?: boolean;
}>();

const router = useRouter();

const loginForm = useForm({
    email: '',
    password: '',
    remember: false,
});

// Navigate to dashboard after successful sign in.
const goToDashboard = () => {
    // Mark that user just logged in (for welcome banner)
    sessionStorage.setItem('justLoggedIn', 'true');
    router.push('/dashboard');
};

// Submit login form — only proceed if fields are filled.
const submitLogin = async () => {
    if (!loginForm.data.email || !loginForm.data.password) {
        return;
    }
    await loginForm.post('/login', {
        onSuccess: goToDashboard,
    });
};

const showPhrase = ref(false);
const phraseForm = useForm({ phrase: '' });

// Submit recovery phrase (standalone POST to mock endpoint).
const signInWithPhrase = async () => {
    phraseForm.post('/login/recovery-phrase', {
        onSuccess: goToDashboard,
    });
};

const cancelPhrase = () => {
    showPhrase.value = false;
    phraseForm.reset();
    phraseForm.clearErrors();
};
</script>

<template>
    <div>
        <Head title="Log in" />

        <AuthSplitLayout
            title="Log in to your account"
            description="Enter your email and password below to log in"
        >
            <div
                v-if="status"
                class="mb-4 text-center text-sm font-medium text-green-600"
            >
                {{ status }}
            </div>                <PasskeyVerify>
                <Button
                    v-if="!showPhrase"
                    type="button"
                    variant="outline"
                    class="w-full"
                    @click="showPhrase = true"
                >
                    <ScrollText class="size-4" />
                    Sign in with Recovery phrase
                </Button>

                <div
                    v-else
                    class="border-border bg-muted/40 rounded-xl border p-4"
                >
                    <div class="grid gap-3">
                        <div class="flex items-center justify-between">
                            <Label for="recovery-phrase">Recovery phrase</Label>
                            <button
                                type="button"
                                class="text-muted-foreground hover:text-foreground text-xs underline underline-offset-4"
                                @click="cancelPhrase"
                            >
                                Cancel
                            </button>
                        </div>
                        <textarea
                            id="recovery-phrase"
                            v-model="phraseForm.data.phrase"
                            name="phrase"
                            rows="3"
                            autocomplete="off"
                            autocapitalize="off"
                            spellcheck="false"
                            placeholder="Enter your 12-word recovery phrase, separated by spaces"
                            class="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
                            @keydown.enter.prevent="signInWithPhrase"
                        />
                        <InputError :message="phraseForm.errors.phrase" />
                        <Button
                            type="button"
                            class="w-full"
                            :disabled="
                                phraseForm.processing ||
                                phraseForm.data.phrase.trim() === ''
                            "
                            @click="signInWithPhrase"
                        >
                            <Spinner v-if="phraseForm.processing" />
                            Sign in
                        </Button>
                    </div>
                </div>
            </PasskeyVerify>

            <form
                @submit.prevent="submitLogin"
                class="flex flex-col gap-6"
            >
                <div class="grid gap-6">
                    <div class="grid gap-2">
                        <Label for="email">Email address</Label>
                        <div class="relative">
                            <Mail
                                class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                            />
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autofocus
                                :tabindex="1"
                                autocomplete="email"
                                placeholder="email@example.com"
                                class="pl-10"
                                v-model="loginForm.data.email"
                            />
                        </div>
                        <InputError :message="loginForm.errors.email" />
                    </div>

                    <div class="grid gap-2">
                        <div class="flex items-center justify-between">
                            <Label for="password">Password</Label>
                            <TextLink
                                v-if="canResetPassword"
                                :href="request.url()"
                                class="text-sm"
                                :tabindex="5"
                            >
                                Forgot your password?
                            </TextLink>
                        </div>
                        <PasswordInput
                            id="password"
                            name="password"
                            required
                            :tabindex="2"
                            autocomplete="current-password"
                            placeholder="Password"
                            v-model="loginForm.data.password"
                        />
                        <InputError :message="loginForm.errors.password" />
                    </div>

                    <div class="flex items-center justify-between">
                        <Label for="remember" class="flex items-center space-x-3">
                            <Checkbox id="remember" name="remember" :tabindex="3" v-model="loginForm.data.remember" />
                            <span>Remember me</span>
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        class="mt-4 w-full"
                        :tabindex="4"
                        :disabled="loginForm.processing"
                        data-test="login-button"
                    >
                        <Spinner v-if="loginForm.processing" />
                        Log in
                    </Button>
                </div>

                <div class="text-muted-foreground text-center text-sm">
                    Don't have an account?
                    <TextLink :href="register.url()" :tabindex="5">Sign up</TextLink>
                </div>
            </form>
        </AuthSplitLayout>
    </div>
</template>
