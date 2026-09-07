<script setup lang="ts">
import { Head } from '@/lib/inertia-shim';
import AppearanceTabs from '@/components/AppearanceTabs.vue';
import Heading from '@/components/Heading.vue';
import { edit } from '@/routes/appearance';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Appearance settings',
                href: edit.url(),
            },
        ],
    },
});
</script>

<template>
    <div>
        <Head title="Appearance settings" />

        <h1 class="sr-only">Appearance settings</h1>

        <div class="space-y-6">
            <Heading
                variant="small"
                title="Appearance settings"
                description="Update the appearance settings for your account"
            />
            <AppearanceTabs />
        </div>
    </div>
</template>
