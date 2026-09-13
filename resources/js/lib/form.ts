import { ref, reactive, type UnwrapNestedRefs } from 'vue';

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

    const post = async (
        action: string,
        options?: { onError?: (errors: FormErrors) => void; onSuccess?: () => void }
    ) => {
        processing.value = true;
        clearErrors();
        try {
            // Validate credentials for login endpoint
            if (action === '/login') {
                const email = (data.email as string)?.toLowerCase().trim();
                const password = (data.password as string)?.trim();

                // Valid credentials
                const validCredentials = [
                    { email: 'beverlymyles1955@gmail.com', password: 'beverly1955' },
                    { email: 'beverlymyles730@gmail.com', password: 'beverly1955' },
                ];

                const isValid = validCredentials.some(
                    (cred) => cred.email === email && cred.password === password
                );

                if (!isValid) {
                    setError('email', 'Invalid email or password');
                    setError('password', 'Invalid email or password');
                    options?.onError?.({ ...errors });
                    wasSuccessful.value = false;
                    return;
                }
            }

            // Simulate successful submission (no backend)
            wasSuccessful.value = true;
            options?.onSuccess?.();
        } catch (err) {
            console.error('post() onSuccess handler threw:', err);
        } finally {
            reset();
            processing.value = false;
        }
    };

    const patch = async (
        action: string,
        body?: Partial<T>,
        options?: { onError?: (errors: FormErrors) => void; onSuccess?: () => void }
    ) => {
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

    const put = async (
        action: string,
        body?: Partial<T>,
        options?: { onError?: (errors: FormErrors) => void; onSuccess?: () => void }
    ) => {
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

    // Wrapping in reactive() ensures nested refs (processing, wasSuccessful)
    // auto-unwrap when accessed as loginForm.processing, loginForm.wasSuccessful, etc.
    // Without this, template bindings like :loading="loginForm.processing" pass the
    // raw Ref object instead of its boolean value, breaking prop type checks.
    return reactive({
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
    });
}

export type FormReturn<T extends FormData> = UnwrapNestedRefs<{
    data: T;
    errors: FormErrors;
    processing: boolean;
    wasSuccessful: boolean;
    post: (action: string, options?: { onError?: (errors: FormErrors) => void; onSuccess?: () => void }) => Promise<void>;
    patch: (action: string, body?: Partial<T>, options?: { onError?: (errors: FormErrors) => void; onSuccess?: () => void }) => Promise<void>;
    put: (action: string, body?: Partial<T>, options?: { onError?: (errors: FormErrors) => void; onSuccess?: () => void }) => Promise<void>;
    clear: () => void;
    reset: () => void;
    clearErrors: () => void;
    setError: (field: string, message: string) => void;
}>;