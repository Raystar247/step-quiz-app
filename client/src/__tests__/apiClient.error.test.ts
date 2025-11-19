// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { apiClient } from '../infrastructure/api/apiClient';

vi.mock('../infrastructure/api/client/axiosClient', () => ({
  axiosClient: {
    get: vi.fn(),
    post: vi.fn(),
  }
}));

import { axiosClient } from '../infrastructure/api/client/axiosClient';

describe('apiClient error flows', () => {
  it('returns validation error when validator rejects', async () => {
    (axiosClient.get as any).mockResolvedValue({ data: { foo: 'bar' } });

    const validator = (d: any) => {
      if (!d || d.ok !== true) return { code: 'InvalidFormat', message: 'missing ok' };
      return null;
    };

    const res = await apiClient.get<any>('/some', undefined, validator);
    expect(res.error).toBeDefined();
    expect(res.error?.type).toBe('validation');
    expect(res.data).toBeNull();
  });

  it('normalizes axios thrown network error', async () => {
    const err = { isAxiosError: true, message: 'Network failed' };
    (axiosClient.get as any).mockRejectedValue(err);

    const res = await apiClient.get<any>('/some');
    expect(res.error).toBeDefined();
    expect(res.error?.type).toBe('network');
    expect(res.data).toBeNull();
  });
});
