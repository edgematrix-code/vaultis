<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { Menu, X } from "@lucide/vue"
import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button'
import { useSidebar } from "./utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

const { isMobile, state, toggleSidebar } = useSidebar()
</script>

<template>
  <Button
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    variant="ghost"
    size="icon"
    :class="cn(
        'h-8 w-8 rounded-xl',
        'bg-white/[0.04]',
        'transition-[color,background]',
        'hover:bg-white/[0.10]',
        'active:bg-white/[0.14]',
        'focus-visible:ring-2 focus-visible:ring-vault-mint/50',
        props.class,
    )"
    @click="toggleSidebar"
  >
    <img
        v-if="isMobile || state === 'collapsed'"
        src="/hamburger_icon_3d_v2.svg"
        alt="Open sidebar"
        class="size-6"
    />
    <X v-else
        class="size-5 text-vault-ink"
    />
    <span class="sr-only">Toggle sidebar</span>
  </Button>
</template>
