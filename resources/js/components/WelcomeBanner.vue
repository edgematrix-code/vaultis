<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { usePage } from '@/lib/inertia-shim';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/composables/useInitials';


const page = usePage();
const auth = computed(() => page.props.auth);
const user = computed(() => auth.value?.user);

const showWelcome = ref(false);

onMounted(() => {
    // Only show on login — not on page refresh
    const justLoggedIn = sessionStorage.getItem('justLoggedIn') === 'true';
    if (justLoggedIn && user.value) {
        showWelcome.value = true;
        sessionStorage.removeItem('justLoggedIn');
        setTimeout(() => {
            showWelcome.value = false;
        }, 5000);
    }
});
</script>

<template>
    <Transition
        enter-active-class="transition-opacity duration-700 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-1000 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div
            v-if="showWelcome && user"
            class="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[80%] max-w-2xl"
        >
            <div class="flex items-center gap-4 rounded-2xl border-2 border-vault-mint/40 bg-white/95 px-6 py-5 shadow-2xl backdrop-blur-sm">
                <Avatar class="size-14 overflow-hidden rounded-full ring-4 ring-vault-mint/50">
                    <AvatarImage v-if="user.avatar" :src="user.avatar" :alt="user.name" />
                    <AvatarFallback class="rounded-lg text-xl font-extrabold text-vault-mint bg-vault-mint/10">
                        {{ getInitials(user.name) }}
                    </AvatarFallback>
                </Avatar>
                <div class="text-center">
                    <p class="text-foreground font-extrabold text-xl tracking-tight">
                        {{ user.name }}
                    </p>
                    <p class="text-vault-mint font-extrabold text-base mt-1">
                        Welcome back
                    </p>
                </div>
            </div>
        </div>
    </Transition>
</template>
