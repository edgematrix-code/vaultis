<script setup lang="ts">
import { CirclePlay, ExternalLink } from '@lucide/vue';

// "How to get $500 USDT" walkthrough video (YouTube).
const videoId = 'EyNnvug3AdQ';
const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
const watchUrl = `https://youtu.be/${videoId}`;
</script>

<template>
    <section class="border-border bg-card rounded-2xl border p-5">
        <div class="mb-4 flex items-start gap-3">
            <div
                class="bg-vault-mint/10 flex size-9 shrink-0 items-center justify-center rounded-lg"
            >
                <CirclePlay class="size-5 text-vault-mint" />
            </div>
            <div class="min-w-0">
                <p class="text-foreground text-sm font-semibold">
                    How to get $500 USDT
                </p>
                <p class="text-vault-ink-dim text-xs">
                    If you don't know how to get USDT, watch this video.
                </p>
            </div>
        </div>

        <!-- 16:9 responsive embed -->
        <div class="bg-secondary/40 relative w-full overflow-hidden rounded-xl border border-border" style="aspect-ratio: 16 / 9">
            <iframe
                :src="embedUrl"
                title="How to get $500 USDT — video guide"
                class="absolute inset-0 size-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                loading="lazy"
                referrerpolicy="strict-origin-when-cross-origin"
            />
        </div>

        <a
            :href="watchUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-vault-ink-dim hover:text-foreground mt-3 inline-flex items-center gap-1.5 text-xs transition-colors"
        >
            Video not loading? Watch it on YouTube
            <ExternalLink class="size-3" />
        </a>
    </section>
</template>
