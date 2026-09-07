import { useRouter } from 'vue-router';

export const router = {
    get currentRoute() {
        return useRouter().currentRoute;
    },
    visit: (url: string) => {
        const r = useRouter();
        // Preserve the Inertia-style behavior where visiting a URL just navigates.
        r.push(url);
    },
    replace: (url: string) => {
        useRouter().replace(url);
    },
    go: (n: number) => {
        history.go(n);
    },
    back: () => {
        window.history.back();
    },
    forward: () => {
        window.history.forward();
    },
    on: () => {
        // Inertia events not needed in standalone mode
    },
    off: () => {
        // Inertia events not needed in standalone mode
    },
};

export { useRouter } from 'vue-router';
