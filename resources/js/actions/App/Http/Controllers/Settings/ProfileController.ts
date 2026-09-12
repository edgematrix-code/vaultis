import { router } from '@/lib/router-shim';

export const destroy = {
  form() {
    return {
      url: '/settings/profile',
      method: 'DELETE',
      data: () => ({}),
      transform: (data: Record<string, unknown>) => data,
      onCancel: () => {
        router.back();
      },
      onSuccess: () => {
        router.push('/login');
      },
    } as const;
  },
};

export default destroy;
