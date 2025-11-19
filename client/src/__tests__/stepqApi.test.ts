// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { stepqApi } from '../features/stepq/api/stepqApi';

vi.mock('../infrastructure/api/client/axiosClient', () => ({
  axiosClient: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(() => Promise.resolve({ data: { id: '1' }, status: 201 })),
    put: vi.fn(() => Promise.resolve({ data: {}, status: 200 })),
  }
}));

describe('stepqApi basic flows', () => {
  it('generateTrial returns string id (or empty string)', async () => {
    const id = await stepqApi.generateTrial('keyword', 'pass', 'user');
    expect(typeof id === 'string').toBeTruthy();
  });
});
