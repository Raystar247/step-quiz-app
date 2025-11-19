import { axiosClient } from './client/axiosClient';

/**
 * Unified API client wrapper
 * - Provides ApiResponse<T> / ApiError types
 * - Centralized error handling via handleApiError
 * - Optional response validation via Validator<T>
 */

export type ValidationErrorCode =
  | 'NotFound'
  | 'UnuniqueResult'
  | 'InvalidFormat'
  | 'BusinessRuleViolated'
  | 'OtherError';

export type ApiError = {
  type: 'network' | 'server' | 'validation' | 'unknown';
  code?: ValidationErrorCode;
  message?: string;
};

export type ApiResponse<T> =
  | { data: T; error: undefined }
  | { data: T | null; error: ApiError };

export type Validator<T> = (data: T) => ApiError | null;

export const handleApiError = (err: unknown): ApiError => {
  // Normalize errors from axios / network
  // eslint-disable-next-line no-console
  console.error('API error:', err);

  if ((err as any)?.isAxiosError) {
    const axiosErr = err as any;
    if (axiosErr.response) {
      return {
        type: 'server',
        message: axiosErr.response?.data?.message || axiosErr.message,
      };
    }
    return { type: 'network', message: axiosErr.message };
  }

  if (err instanceof Error) {
    return { type: 'unknown', message: err.message };
  }

  return { type: 'unknown', message: String(err) };
};

async function safeRequest<T>(fn: () => Promise<any>, validator?: Validator<T>): Promise<ApiResponse<T>> {
  try {
    const res = await fn();
    const data = res?.data as T;
    if (validator) {
      const vErr = validator(data);
      if (vErr) {
        return { data: null, error: { ...vErr, type: 'validation' } };
      }
    }
    return { data, error: undefined };
  } catch (e) {
    const apiErr = handleApiError(e);
    return { data: null, error: apiErr };
  }
}

export const apiClient = {
  async get<T>(url: string, params?: any, validator?: Validator<T>): Promise<ApiResponse<T>> {
    return safeRequest<T>(() => axiosClient.get<T>(url, { params }), validator);
  },

  async post<T>(url: string, body?: any, validator?: Validator<T>): Promise<ApiResponse<T>> {
    return safeRequest<T>(() => axiosClient.post<T>(url, body), validator);
  },

  async put<T>(url: string, body?: any, validator?: Validator<T>): Promise<ApiResponse<T>> {
    return safeRequest<T>(() => axiosClient.put<T>(url, body), validator);
  },

  async delete<T>(url: string, params?: any, validator?: Validator<T>): Promise<ApiResponse<T>> {
    return safeRequest<T>(() => axiosClient.delete<T>(url, { params }), validator);
  },
};

export default apiClient;
