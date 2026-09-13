<script setup lang="ts">
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

defineProps<{
    loading?: boolean;
    disabled?: boolean;
}>();

const emit = defineEmits<{
    submit: [];
}>();
</script>

<template>
    <Button
        type="submit"
        class="mt-4 w-full"
        :disabled="disabled || loading"
        data-test="login-button"
        @click="emit('submit')"
    >
        <Spinner v-if="loading" />
        Log in
    </Button>
</template>
