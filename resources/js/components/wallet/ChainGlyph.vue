<script setup lang="ts">
import { computed } from 'vue';
import { CHAINS } from '@/lib/wallet-data';
import type { ChainId } from '@/types/wallet';
import { cn } from '@/lib/utils';

const props = withDefaults(
    defineProps<{
        chain: ChainId;
        size?: 'sm' | 'md' | 'lg';
    }>(),
    { size: 'md' },
);

const chain = computed(() => CHAINS[props.chain]);

const sizeClasses = computed(
    () =>
        ({
            sm: 'h-5 w-5',
            md: 'h-7 w-7',
            lg: 'h-9 w-9',
        })[props.size],
);
</script>

<template>
    <img
        :src="chain.logo"
        :alt="`${chain.name} logo`"
        :class="cn('object-contain shrink-0', sizeClasses)"
        loading="lazy"
    />
</template>
