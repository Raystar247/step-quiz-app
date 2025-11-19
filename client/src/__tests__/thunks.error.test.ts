// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { generateTrial } from '../features/stepq/store/trial';

// mock the whole stepqApi implementation used by thunks
vi.mock('../features/stepq/api/stepqApi', () => ({
  stepqApi: {
    generateTrial: vi.fn(),
  }
}));

import { stepqApi } from '../features/stepq/api/stepqApi';

describe('trial thunks error flows', () => {
  it('generateTrial thunk returns rejected action when api throws', async () => {
    (stepqApi.generateTrial as any).mockImplementation(() => { throw new Error('boom'); });

    const thunk = generateTrial({ qgroupKeyword: 'k', passphrase: 'p', userId: 'u' }) as any;
    const dispatch = vi.fn();
    const getState = vi.fn();

    const result = await thunk(dispatch, getState, undefined);

    expect(result.type).toMatch(/rejected$/);
    expect(result.error).toBeDefined();
    expect(result.error.message).toBeDefined();
  });
});
