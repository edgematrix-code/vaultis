import { router } from '@/lib/router-shim';

export const update = {
  form() {
    return {
      url: '/settings/password',
      method: 'PUT',
      data: () => ({}),
      transform: (data: Record<string, unknown>) => data,
      onSuccess: () => {
        router.back();
      },
    } as const;
  },
};

export default update;
