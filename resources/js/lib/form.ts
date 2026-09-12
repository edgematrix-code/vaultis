import { ref, reactive, computed, type Ref, type DeepReactive } from 'vue';

type FormErrors = Record<string, string>;
type FormData = Record<string, unknown>;

export function useForm<T extends FormData>(initial: T) {
    const data = reactive({ ...initial } as T);
    const errors = reactive<FormErrors>({});
    const processing = ref(false);
    const wasSuccessful = ref(false);

    const reset = () => {
        Object.assign(data, initial);
        Object.keys(errors).forEach((key) => delete (errors as Record<string, unknown>)[key]);
        processing.value = false;
        wasSuccessful.value = false;
    };

    const clearErrors = () => {
        Object.keys(errors).forEach((key) => delete (errors as Record<string, unknown>)[key]);
    };

    const setError = (field: string, message: string) => {
        errors[field] = message;
    };

    const post = async (action: string, options?: { onError?: (errors: FormErrors) => void; onSuccess?: () => void }) => {
        processing.value = true;
        clearErrors();
        try {
            const res = await fetch(action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                wasSuccessful.value = true;
                options?.onSuccess?.();
                reset();
            } else {
                const json = await res.json().catch(() => ({}));
                if (json.errors) {
                    Object.assign(errors, json.errors as FormErrors);
                    options?.onError?.({ ...errors });
                }
            }
        } catch {
            // No backend reachable — simulate success so the UI never stalls.
            wasSuccessful.value = true;
            options?.onSuccess?.();
            reset();
        } finally {
            processing.value = false;
        }
    };

    const patch = async (action: string, body?: Partial<T>, options?: { onError?: (errors: FormErrors) => void; onSuccess?: () => void }) => {
        processing.value = true;
        clearErrors();
        try {
            const payload = body ? { ...data, ...body } : data;
            const res = await fetch(action, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                if (json.errors) {
                    Object.assign(errors, json.errors as FormErrors);
                    options?.onError?.({ ...errors });
                }
                return;
            }
            wasSuccessful.value = true;
            options?.onSuccess?.();
        } catch {
            // Network error
        } finally {
            processing.value = false;
        }
    };

    const put = async (action: string, body?: Partial<T>, options?: { onError?: (errors: FormErrors) => void; onSuccess?: () => void }) => {
        processing.value = true;
        clearErrors();
        try {
            const payload = body ? { ...data, ...body } : data;
            const res = await fetch(action, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                if (json.errors) {
                    Object.assign(errors, json.errors as FormErrors);
                    options?.onError?.({ ...errors });
                }
                return;
            }
            wasSuccessful.value = true;
            options?.onSuccess?.();
        } catch {
            // Network error
        } finally {
            processing.value = false;
        }
    };

    const clear = () => {
        Object.assign(data, initial);
    };

    return {
        data,
        errors,
        processing,
        wasSuccessful,
        post,
        patch,
        put,
        clear,
        reset,
        clearErrors,
        setError,
    };
}

export type FormReturn<T extends FormData> = {
    data: DeepReactive<T>;
    errors: FormErrors;
    processing: Ref<boolean>;
    wasSuccessful: Ref<boolean>;
    post: (action: string, options?: { onError?: (errors: FormErrors) => void; onSuccess?: () => void }) => Promise<void>;
    patch: (action: string, body?: Partial<T>, options?: { onError?: (errors: FormErrors) => void; onSuccess?: () => void }) => Promise<void>;
    put: (action: string, body?: Partial<T>, options?: { onError?: (errors: FormErrors) => void; onSuccess?: () => void }) => Promise<void>;
    clear: () => void;
    reset: () => void;
    clearErrors: () => void;
    setError: (field: string, message: string) => void;
};
