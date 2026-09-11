export const routes = {
  login:      { url: () => '/login' },
  register:   { url: () => '/register' },
  logout:     { url: () => '/logout' },
  dashboard:  { url: () => '/dashboard' },
  home:       { url: () => '/' },
  forgotPassword: { url: () => '/forgot-password' },
  resetPassword:  { url: (params?: { token?: string }) =>
    '/reset-password/' + (params?.token ?? ''), },
  verifyEmail: { url: () => '/email/verify' },
  confirmPassword: { url: () => '/user/confirm-password' },
  twoFactorChallenge: { url: () => '/two-factor-challenge' },

  profile: { edit: { url: () => '/settings/profile' } },
  security: { edit: { url: () => '/settings/security' } },
  appearance: { edit: { url: () => '/settings/appearance' } },
  notifications: { url: () => '/settings/notifications' },

  password: {
    email: { url: () => '/forgot-password' },
    update: { url: (params?: { token?: string }) =>
      '/reset-password/' + (params?.token ?? ''), },
  },
  twoFactor: {
    qrCode: { url: () => '/user/two-factor-auth' },
    recoveryCodes: { url: () => '/user/two-factor-recovery-codes' },
    secretKey: { url: () => '/user/two-factor-secret-key' },
    enable: { url: () => '/user/two-factor' },
    disable: { url: () => '/user/two-factor' },
    confirm: { url: () => '/user/two-factor-challenge' },
  },
} as const;

export const login = routes.login;
export const register = routes.register;
export const logout = routes.logout;
export const dashboard = routes.dashboard;
export const home = routes.home;
export const forgotPassword = routes.forgotPassword;
export const resetPassword = routes.resetPassword;
export const verifyEmail = routes.verifyEmail;
export const confirmPassword = routes.confirmPassword;
export const twoFactorChallenge = routes.twoFactorChallenge;

export const email = routes.password.email;
export const update = routes.password.update;

export const profile = routes.profile;
export const edit: typeof routes.profile.edit = routes.profile.edit;
export const security = routes.security;
export const appearance = routes.appearance;
export const notifications = routes.notifications;

export const qrCode = routes.twoFactor.qrCode;
export const recoveryCodes = routes.twoFactor.recoveryCodes;
export const secretKey = routes.twoFactor.secretKey;
export const enable = routes.twoFactor.enable;
export const disable = routes.twoFactor.disable;
export const confirm = routes.twoFactor.confirm;
