// Drop-in shim for @inertiajs/vue3
// Provides the symbols that existing page/component code imports,
// wired to vue-router / local state instead of a Laravel backend.

import { useRouter, RouterLink, type RouterLinkProps } from 'vue-router';
import { defineComponent, h, reactive } from 'vue';

// --- Inertia <Link> replacement ---
// Accepts both Inertia-style :href and vue-router :to.
export const Link = defineComponent({
    name: 'Link',
    props: {
        to: { type: [String, Object], default: undefined },
        href: { type: String, default: undefined },
        activeClass: { type: String, default: 'active' },
        exactActiveClass: { type: String, default: 'exact-active' },
        prefetch: { type: Boolean, default: false },
        method: { type: String, default: undefined },
        replace: { type: Boolean, default: false },
        as: { type: String, default: 'a' },
        tabindex: { type: Number, default: undefined },
        ...RouterLink.props,
    },
    inheritAttrs: true,
    setup(props, { slots, attrs }) {
        const effectiveTo = props.to ?? props.href ?? '/';

        return () =>
            h(RouterLink, {
                key: String(effectiveTo),
                to: effectiveTo,
                ...attrs,
                activeClass: props.activeClass,
                exactActiveClass: props.exactActiveClass,
                replace: props.replace,
                prefetch: props.prefetch,
            }, () =>
                slots.default
                    ? slots.default({
                        href: effectiveTo,
                        navigate: () => {},
                    })
                    : null,
            );
    },
});

// --- usePage() shim ---
// Returns a reactive proxy (not a ref) so callers can use
// `page.props.auth.user` without needing `.value`.
const _pageState = {
    props: {
        auth: {
            user: {
                name: 'Demo User',
                email: 'demo@vaultis.app',
                avatar: null as string | null,
            },
        },
        csrfToken: '',
        sidebarOpen: true,
    },
    url: '/',
    component: null as unknown,
    attrs: {},
    clearHistory: false,
    replace: false,
    preserveScroll: false,
    errors: {} as Record<string, string>,
};

export function usePage() {
    return reactive(_pageState);
}

// --- router shim ( Inertia router.visit / replace / go / back / forward ) ---
const _inertiaRouter = {
    get currentRoute() {
        return useRouter().currentRoute;
    },
    visit: (url: string) => useRouter().push(url),
    replace: (url: string) => useRouter().replace(url),
    go: (n: number) => history.go(n),
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    on: () => {},
    off: () => {},
};

export { _inertiaRouter as router };

// --- Form helper ---
export const Form = defineComponent({
    name: 'Form',
    props: {
        method: { type: String, default: 'post' },
        action: { type: String, default: '' },
        as: { type: String, default: 'div' },
    },
    emits: ['submit'],
    setup(props, { emit, slots }) {
        function handleSubmit(e: Event) {
            emit('submit', e);
        }

        return () =>
            h(
                props.as || 'div',
                {
                    onSubmit: handleSubmit,
                    style: 'display:contents',
                },
                slots.default ? slots.default() : [],
            );
    },
});

// --- useHttp shim ---
export function useHttp() {
    return {
        post: async () => { throw new Error('useHttp not implemented'); },
        put: async () => { throw new Error('useHttp not implemented'); },
        delete: async () => { throw new Error('useHttp not implemented'); },
    };
}

// --- Types ---
export type InertiaLinkProps = RouterLinkProps;

// --- Head component ---
export const Head = defineComponent({
    name: 'Head',
    props: {
        title: { type: String, default: '' },
    },
    setup(props) {
        if (props.title) {
            document.title = props.title.includes('—')
                ? props.title
                : props.title + ' — Vaultis';
        }
        return () => null;
    },
});
