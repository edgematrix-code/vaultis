<script setup lang="ts">
import { Head, Link } from '@/lib/inertia-shim';
import { computed, ref } from 'vue';
import { RouterLink as RouterLinkComponent } from 'vue-router';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/DeleteUser.vue';
import Heading from '@/components/Heading.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import { MOCK_AUTH } from '@/lib/data';
import { useForm } from '@/lib/form';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Profile settings',
                href: edit.url(),
            },
        ],
    },
});

const user = ref(MOCK_AUTH.user);
const profileForm = useForm({
    name: user.value?.name ?? '',
    email: user.value?.email ?? '',
});

const updateProfile = async () => {
    await profileForm.patch('/settings/profile', {
        name: profileForm.data.name,
        email: profileForm.data.email,
    });
};

/* @chisel-email-verification */
const sendVerification = async () => {
    await profileForm.post('/email/verification-notification', {});
};
/* @end-chisel-email-verification */
</script>

<template>
    <div>
        <Head title="Profile settings" />

        <h1 class="sr-only">Profile settings</h1>

        <div class="flex flex-col space-y-6">
            <Heading
                variant="small"
                title="Profile"
                description="Update your name and email address"
            />

            <form
                @submit.prevent="updateProfile"
                class="space-y-6"
            >
                <div class="grid gap-2">
                    <Label for="name">Name</Label>
                    <Input
                        id="name"
                        class="mt-1 block w-full"
                        name="name"
                        :value="profileForm.data.name"
                        required
                        autocomplete="name"
                        placeholder="Full name"
                        v-model="profileForm.data.name"
                    />
                    <InputError class="mt-2" :message="profileForm.errors.name" />
                </div>

                <div class="grid gap-2">
                    <Label for="email">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        class="mt-1 block w-full"
                        name="email"
                        :value="profileForm.data.email"
                        required
                        autocomplete="username"
                        placeholder="Email address"
                        v-model="profileForm.data.email"
                    />
                    <InputError class="mt-2" :message="profileForm.errors.email" />
                </div>

                <!-- @chisel-email-verification -->
                <div v-if="false && !user.value?.email_verified_at">
                    <p class="text-muted-foreground -mt-4 text-sm">
                        Your email address is unverified.
                        <button
                            type="button"
                            @click="sendVerification"
                            class="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                        >
                            Click here to re-send the verification email.
                        </button>
                    </p>

                    <div
                        v-if="false"
                        class="mt-2 text-sm font-medium text-green-600"
                    >
                        A new verification link has been sent to your email address.
                    </div>
                </div>
                <!-- @end-chisel-email-verification -->

                <div class="flex items-center gap-4">
                    <Button :disabled="profileForm.processing" data-test="update-profile-button"
                        >Save</Button
                    >
                </div>
            </form>
        </div>

        <DeleteUser />
    </div>
</template>
