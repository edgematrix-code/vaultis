<script setup lang="ts">
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';
import { Head } from '@/lib/inertia-shim';
import Heading from '@/components/Heading.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useForm } from '@/lib/form';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Help & support',
                href: '/support',
            },
        ],
    },
});

const topics = [
    'Account & login',
    'Deposits',
    'Withdrawals',
    'Swap / exchange',
    'Two-factor authentication',
    'Something else',
] as const;

type Topic = (typeof topics)[number];

const supportForm = useForm({
    name: '',
    email: '',
    topic: '' as Topic | '',
    message: '',
});

const submitted = ref(false);
const submittedEmail = ref('');

const messageCount = computed(() => supportForm.data.message.length);
const minMessageLength = 20;

const validate = (): boolean => {
    let valid = true;

    if (!supportForm.data.name.trim()) {
        supportForm.setError('name', 'Please tell us your name.');
        valid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(supportForm.data.email))) {
        supportForm.setError('email', 'Enter a valid email address.');
        valid = false;
    }

    if (!supportForm.data.topic) {
        supportForm.setError('topic', 'Choose what your message is about.');
        valid = false;
    }

    if (supportForm.data.message.trim().length < minMessageLength) {
        supportForm.setError(
            'message',
            `Please describe the issue in at least ${minMessageLength} characters.`,
        );
        valid = false;
    }

    return valid;
};

const submitTicket = () => {
    if (!validate()) {
        return;
    }

    supportForm.post('/support', {
        onSuccess: () => {
            submittedEmail.value = String(supportForm.data.email);
            submitted.value = true;
            toast.success('Message sent', {
                description:
                    'A customer representative will reply to your email shortly.',
            });
        },
    });
};
</script>

<template>
    <div>
        <Head title="Help & support" />

        <div class="space-y-6">
            <Heading
                title="Help & support"
                description="Send a message to our customer support team — we usually reply within one business day."
            />

            <div
                v-if="submitted"
                class="border-vault-mint/30 bg-vault-mint/10 text-vault-mint rounded-lg border p-4"
                data-test="support-success"
            >
                <p class="font-medium">Thanks — your message is on its way.</p>
                <p class="text-vault-ink-dim mt-1 text-sm">
                    A customer representative will get back to you at
                    {{ submittedEmail }}.
                </p>
            </div>

            <form
                v-else
                @submit.prevent="submitTicket"
                class="space-y-6"
                data-test="support-form"
            >
                <div class="grid gap-4 sm:grid-cols-2">
                    <div class="grid gap-2">
                        <Label for="name">Your name</Label>
                        <Input
                            id="name"
                            name="name"
                            required
                            autocomplete="name"
                            placeholder="Full name"
                            v-model="supportForm.data.name"
                        />
                        <InputError :message="supportForm.errors.name" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            required
                            autocomplete="email"
                            placeholder="email@example.com"
                            v-model="supportForm.data.email"
                        />
                        <InputError :message="supportForm.errors.email" />
                    </div>
                </div>

                <div class="grid gap-2">
                    <Label for="topic">What is it about?</Label>
                    <Select v-model="supportForm.data.topic">
                        <SelectTrigger id="topic" class="w-full">
                            <SelectValue placeholder="Choose a topic" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                v-for="topic in topics"
                                :key="topic"
                                :value="topic"
                            >
                                {{ topic }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError :message="supportForm.errors.topic" />
                </div>

                <div class="grid gap-2">
                    <div class="flex items-center justify-between">
                        <Label for="message">Message</Label>
                        <span
                            class="text-muted-foreground text-xs"
                            :class="{
                                'text-destructive':
                                    messageCount > 0 &&
                                    messageCount < minMessageLength,
                            }"
                        >
                            {{ messageCount }} characters
                        </span>
                    </div>
                    <Textarea
                        id="message"
                        name="message"
                        required
                        rows="6"
                        placeholder="Describe the issue, including any transaction IDs or wallet addresses involved…"
                        v-model="supportForm.data.message"
                    />
                    <InputError :message="supportForm.errors.message" />
                </div>

                <div class="flex items-center gap-4">
                    <Button
                        type="submit"
                        :disabled="supportForm.processing"
                        data-test="send-support-message-button"
                    >
                        <Spinner v-if="supportForm.processing" />
                        Send message
                    </Button>

                    <p class="text-muted-foreground text-xs">
                        By sending, you agree to be contacted about this
                        request.
                    </p>
                </div>
            </form>
        </div>
    </div>
</template>
