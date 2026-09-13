<script setup lang="ts">
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

defineProps<{
    loading?: boolean;
    disabled?: boolean;
}>();
</script>

<template>
    <Button
        type="submit"
        class="mt-4 w-full"
        :disabled="disabled || loading"
        data-test="login-button"
    >
        <Spinner v-if="loading" />
        Log in
    </Button>
</template>