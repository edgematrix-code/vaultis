<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Avatar } from '@/components/ui/avatar';

const props = defineProps<{
  name: string;
  email: string;
}>();

const show = ref(true);
const avatarUrl = '/BeverlyMyles.png';

onMounted(() => {
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    show.value = false;
  }, 5000);
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <div
          class="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl shadow-black/40 p-8 text-center"
        >
          <!-- Close button -->
          <button
            type="button"
            class="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            @click="show = false"
          >
            <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Profile image -->
          <Avatar class="mx-auto size-20 overflow-hidden rounded-full ring-4 ring-vault-mint/50">
            <img
              :src="avatarUrl"
              :alt="name"
              class="object-cover"
            />
          </Avatar>

          <!-- Name -->
          <h2
            class="mt-4 text-foreground text-xl font-bold tracking-tight"
          >
            Welcome Back
          </h2>
          <p
            class="mt-1 text-foreground font-semibold"
          >
            {{ name }}
          </p>

          <!-- Email -->
          <p
            class="mt-1 text-vault-ink-dim text-sm"
          >
            {{ email }}
          </p>

          <!-- Subtitle -->
          <p
            class="mt-4 text-vault-ink-dim text-sm"
          >
            Glad to see you again! Your dashboard is ready.
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
