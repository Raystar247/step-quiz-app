jest.mock('../../repositories/qgroup.repository', () => ({
  findByTitleExact: jest.fn(),
}));

jest.mock('../../repositories/trial.repository', () => ({
  findByUserAndQGroup: jest.fn(),
  create: jest.fn(),
}));

const qgroupRepo = require('../../repositories/qgroup.repository') as any;
const trialRepo = require('../../repositories/trial.repository') as any;
const trialService = require('../trial.service') as any;

describe('TrialService.createOrGetTrial', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('throws when qgroup not found', async () => {
    qgroupRepo.findByTitleExact.mockResolvedValue(null);
    await expect(trialService.createOrGetTrial({ title: 'x', passphrase: 'p', userId: 'u' })).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('throws when passphrase mismatch', async () => {
    qgroupRepo.findByTitleExact.mockResolvedValue({ id: 'q1', passphrase: 'ok' });
    await expect(trialService.createOrGetTrial({ title: 'x', passphrase: 'bad', userId: 'u' })).rejects.toMatchObject({ code: 'VALIDATION_ERROR' });
  });

  it('returns existing trial when found', async () => {
    qgroupRepo.findByTitleExact.mockResolvedValue({ id: 'q1', passphrase: 'ok' });
    trialRepo.findByUserAndQGroup.mockResolvedValue({ id: 't1', qgroupId: 'q1', userId: 'u' });
    const res = await trialService.createOrGetTrial({ title: 'x', passphrase: 'ok', userId: 'u' });
    expect(res).toMatchObject({ id: 't1' });
  });

  it('creates a new trial when none exists', async () => {
    qgroupRepo.findByTitleExact.mockResolvedValue({ id: 'q1', passphrase: 'ok' });
    trialRepo.findByUserAndQGroup.mockResolvedValue(null);
    trialRepo.create.mockResolvedValue({ id: 't2', qgroupId: 'q1', userId: 'u', index: 1 });
    const res = await trialService.createOrGetTrial({ title: 'x', passphrase: 'ok', userId: 'u' });
    expect(res).toMatchObject({ id: 't2' });
  });
});
