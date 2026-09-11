export const request = {
  url: () => '/forgot-password',
};
export const email = { url: () => '/forgot-password' };
export const update = {
  url: (params?: { token?: string }) =>
    '/reset-password/' + (params?.token ?? ''),
};
