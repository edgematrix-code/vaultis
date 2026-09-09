import { createApp, defineComponent, h, resolveComponent } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { initializeTheme } from '@/composables/useAppearance';
import AppLayout from '@/layouts/AppLayout.vue';
import AuthLayout from '@/layouts/auth/AuthSimpleLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import WelcomePage from '@/pages/Welcome.vue';
import LoginPage from '@/pages/auth/Login.vue';
import RegisterPage from '@/pages/auth/Register.vue';
import RecoveryPhrasePage from '@/pages/auth/RecoveryPhrase.vue';
import DashboardPage from '@/pages/Dashboard.vue';
import WalletOverviewPage from '@/pages/wallet/Overview.vue';
import WalletDepositPage from '@/pages/wallet/Deposit.vue';
import WalletReceivePage from '@/pages/wallet/Receive.vue';
import WalletUpgradePage from '@/pages/wallet/Upgrade.vue';
import WalletWithdrawPage from '@/pages/wallet/Withdraw.vue';
import WalletSwapPage from '@/pages/wallet/Swap.vue';
import TransactionsIndexPage from '@/pages/transactions/Index.vue';
import TransactionShowPage from '@/pages/transactions/Show.vue';
import ProfilePage from '@/pages/settings/Profile.vue';
import SecurityPage from '@/pages/settings/Security.vue';
import NotificationsPage from '@/pages/settings/Notifications.vue';
import AppearancePage from '@/pages/settings/Appearance.vue';
import ForgotPasswordPage from '@/pages/auth/ForgotPassword.vue';
import ResetPasswordPage from '@/pages/auth/ResetPassword.vue';
import VerifyEmailPage from '@/pages/auth/VerifyEmail.vue';
import ConfirmPasswordPage from '@/pages/auth/ConfirmPassword.vue';
import TwoFactorChallengePage from '@/pages/auth/TwoFactorChallenge.vue';
import { initializeFlashToast } from '@/lib/flashToast';
import { toast } from 'vue-sonner';

// --- DEBUG: verify all imports resolved ---
console.log('✅ [app.ts] all imports resolved');
console.log('   AuthLayout:', AuthLayout);
console.log('   AppLayout:', AppLayout);
console.log('   SettingsLayout:', SettingsLayout);
console.log('   WelcomePage:', WelcomePage);
console.log('   vue-sonner toast:', typeof toast);

const appName = import.meta.env.VITE_APP_NAME || 'Vaultis';

function getLayout(name: string) {
    switch (true) {
        case name === 'Welcome':
            return null;
        case name === 'auth/Login' ||
            name === 'auth/Register' ||
            name === 'auth/RecoveryPhrase':
            return null;
        case name.startsWith('auth/'):
            return AuthLayout;
        case name.startsWith('settings/'):
            return [AppLayout, SettingsLayout];
        default:
            return AppLayout;
    }
}

const routes = [
    { path: '/', name: 'Welcome', component: WelcomePage },
    { path: '/login', name: 'auth/Login', component: LoginPage },
    { path: '/register', name: 'auth/Register', component: RegisterPage },
    { path: '/register/recovery-phrase', name: 'auth/RecoveryPhrase', component: RecoveryPhrasePage },
    { path: '/dashboard', name: 'Dashboard', component: DashboardPage },
    { path: '/wallet', name: 'wallet/Overview', component: WalletOverviewPage },
    { path: '/wallet/upgrade', name: 'wallet/Upgrade', component: WalletUpgradePage },
    { path: '/wallet/deposit', name: 'wallet/Deposit', component: WalletDepositPage },
    { path: '/wallet/receive', name: 'wallet/Receive', component: WalletReceivePage },
    { path: '/wallet/swap', name: 'wallet/Swap', component: WalletSwapPage },
    { path: '/wallet/withdraw', name: 'wallet/Withdraw', component: WalletWithdrawPage },
    { path: '/transactions', name: 'transactions/Index', component: TransactionsIndexPage },
    { path: '/transactions/:id', name: 'transactions/Show', component: TransactionShowPage },
    { path: '/settings/profile', name: 'settings/Profile', component: ProfilePage },
    { path: '/settings/security', name: 'settings/Security', component: SecurityPage },
    { path: '/settings/notifications', name: 'settings/Notifications', component: NotificationsPage },
    { path: '/settings/appearance', name: 'settings/Appearance', component: AppearancePage },
    { path: '/forgot-password', name: 'auth/ForgotPassword', component: ForgotPasswordPage },
    { path: '/reset-password/:token', name: 'auth/ResetPassword', component: ResetPasswordPage },
    { path: '/email/verify', name: 'auth/VerifyEmail', component: VerifyEmailPage },
    { path: '/user/confirm-password', name: 'auth/ConfirmPassword', component: ConfirmPasswordPage },
    { path: '/two-factor-challenge', name: 'auth/TwoFactorChallenge', component: TwoFactorChallengePage },
];

const router = createRouter({
    history: createWebHistory('/'),
    routes,
    scrollBehavior(_to, _from, savedPosition) {
        if (savedPosition) return savedPosition;
        return { top: 0 };
    },
});

router.beforeEach((to, _from, next) => {
    console.log('🔒 [router.beforeEach] navigating to:', to.name, to.path);
    const layout = getLayout(to.name || '');
    if (!layout) {
        console.log('🔒 [router.beforeEach] no layout for', to.name, '- rendering page directly');
        next();
        return;
    }
    (to.meta as Record<string, unknown>).layout = layout;
    next();
});

router.onError((err) => {
    console.error('❌ [router] navigation error:', err);
});

// Catch navigation errors at the router level.
const originalPush = router.push.bind(router);
router.push = function (location: unknown, onComplete?: () => void, onAbort?: () => void) {
    try {
        return originalPush(location, onComplete, onAbort);
    } catch (err) {
        console.error('❌ [router.push] error navigating:', err);
        throw err;
    }
};

// Root component that wraps pages in their layout.
const Root = defineComponent({
    name: 'Root',
    setup() {
        const pageCache = new Map<string, unknown>();
        const layoutCache = new Map<string, unknown>();

        const pageMap: Record<string, unknown> = {};
        for (const r of routes) {
            pageMap[r.name as string] = r.component;
        }

        return () => {
            try {
                const currentRoute = router.currentRoute.value;
                const name = currentRoute.name?.toString() || '';
                console.log('🔍 [Root.render] route name:', name, 'path:', currentRoute.path);

                const pageComponent = pageCache.get(name) ?? pageMap[name];
                if (!pageComponent) {
                    console.error('❌ [Root.render] no component for route:', name, 'available:', Object.keys(pageMap));
                    return h('div', { style: 'padding:2rem;color:#b91c1c;font-family:monospace' }, [
                        h('h2', 'Page component not found: ' + name),
                        h('pre', JSON.stringify({ name, available: Object.keys(pageMap), path: currentRoute.path }, null, 2)),
                    ]);
                }

                const raw = getLayout(name);
                console.log('🔍 [Root.render] layout for', name + ':', raw ? (Array.isArray(raw) ? raw.map(c => c.name) : raw.name) : 'none');

                if (raw === null) {
                    return h(pageComponent as unknown as object, { key: name });
                }

                if (Array.isArray(raw)) {
                    let inner = h(pageComponent as unknown as object, { key: name });
                    for (let i = raw.length - 1; i >= 0; i--) {
                        inner = h(raw[i] as unknown as object, { key: 'l' + i }, { default: () => inner });
                    }
                    return inner;
                }

                return h(raw as unknown as object, { key: 'layout-' + name }, { default: () => h(pageComponent as unknown as object, { key: name }) });
            } catch (err) {
                console.error('❌ [Root.render] render error for route', router.currentRoute.value.name + ':', err);
                return h('div', { style: 'padding:2rem;color:#b91c1c;font-family:monospace' }, [
                    h('h2', 'Render error'),
                    h('pre', escapeHtml(String(err?.stack ?? err ?? 'unknown'))),
                ]);
            }
        };
    },
});

// --- DEBUG: mount wrapper ---
try {
    const app = createApp(Root);
    app.use(router);

    // ── Register shared UI components globally ──────────────────────────
    const { Head } = await import('@/lib/inertia-shim');
    app.component('Head', Head);

    const mounted = app.mount('#app');
    console.log('✅ [app.ts] Vue app mounted:', !!mounted);
} catch (err) {
    console.error('❌ [app.ts] Failed to mount Vue app:', err);
    const el = document.getElementById('app');
    if (el) {
        el.innerHTML = `
            <div style="padding:2rem;color:#b91c1c;font-family:monospace">
                <h2>❌ Vue app failed to mount</h2>
                <pre>${escapeHtml(String(err?.stack ?? err ?? 'unknown'))}</pre>
            </div>`;
    }
}

function escapeHtml(s: string): string {
    return s.replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c] ?? c));
}

try { initializeTheme(); } catch (e) { console.error('❌ [app.ts] initializeTheme failed:', e); }
try { initializeFlashToast(); } catch (e) { console.error('❌ [app.ts] initializeFlashToast failed:', e); }

// --- DEBUG: log every router navigation error ---
router.onError((err) => {
    console.error('❌ [router] navigation error:', err);
    if (err?.message?.includes?.('Failed to fetch')) {
        toast.error('Network error — please try again.');
    }
});

// --- DEBUG: log every unhandled Vue/JS error ---
window.addEventListener('error', (e) => {
    console.error('❌ [window] uncaught error:', e.error ?? e);
});
window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ [window] unhandled promise rejection:', e.reason ?? e);
});

// --- DEBUG: log the initial route so we know what the router sees ---
router.isReady().then(() => {
    console.log('✅ [router] ready. Initial route:', router.currentRoute.value);
}).catch((err) => {
    console.error('❌ [router] failed to resolve initial route:', err);
});
