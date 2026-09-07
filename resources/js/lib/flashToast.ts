// Standalone flash toast listener (replaces Inertia router events).
import { toast } from 'vue-sonner';
import type { FlashToast } from '@/types/ui';

export function initializeFlashToast(): void {
    // Listen for custom flash events dispatched by the app.
    window.addEventListener('flash', (event: Event) => {
        const custom = event as CustomEvent;
        const flash = (custom.detail as { flash?: { toast?: FlashToast } })?.flash;
        const data = flash?.toast;

        if (!data) {
            return;
        }

        const methods: Record<string, (message: string) => void> = {
            success: toast.success,
            info: toast.info,
            warning: toast.warning,
            error: toast.error,
        };

        const fn = methods[data.type] || toast.info;
        fn(data.message);
    });
}
