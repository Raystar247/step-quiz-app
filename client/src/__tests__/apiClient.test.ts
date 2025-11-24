// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { apiClient } from '../infrastructure/api/apiClient';

vi.mock('../infrastructure/api/client/axiosClient', () => ({
  axiosClient: {
    get: vi.fn(() => Promise.resolve({ data: { ok: true } })),
    post: vi.fn(() => Promise.resolve({ data: { id: '1' } })),
  }
}));

describe('apiClient', () => {
  it('returns data on successful get', async () => {
    const res = await apiClient.get<any>('/test');
    expect(res.error).toBeUndefined();
    expect(res.data).toBeDefined();
  });

  it('returns data on successful post', async () => {
    const res = await apiClient.post<any>('/test', { a: 1 });
    expect(res.error).toBeUndefined();
    expect(res.data).toBeDefined();
  });
});
