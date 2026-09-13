<script setup lang="ts">
import { Head } from '@/lib/inertia-shim';
</script>

<template>
    <div class="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <Head title="Page not found" />

        <p class="text-muted-foreground text-sm font-semibold tracking-widest uppercase">
            404
        </p>
        <h1 class="text-foreground text-3xl font-bold tracking-tight">Page not found</h1>
        <p class="text-muted-foreground max-w-md text-sm">
            The page you are looking for doesn't exist or has been moved.
        </p>
        <RouterLink
            to="/"
            class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium"
        >
            Back to home
        </RouterLink>
    </div>
</template>
