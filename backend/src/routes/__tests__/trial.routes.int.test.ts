import request from 'supertest';
const app = require('../../app').default;
import jwt from 'jsonwebtoken';
import config from '../../config/default';

jest.mock('../../repositories/qgroup.repository');
jest.mock('../../repositories/trial.repository');

const qgroupRepo = require('../../repositories/qgroup.repository');
const trialRepo = require('../../repositories/trial.repository');

describe('Trial routes (integration)', () => {
  const token = jwt.sign({ userId: '00000000-0000-0000-0000-000000000001' }, config.jwtSecret, { expiresIn: '1h' });

  beforeEach(() => jest.resetAllMocks());

  it('rejects unauthenticated POST /api/trial', async () => {
    const res = await request(app).post('/api/trial').send({ title: 't', passphrase: 'p', userId: 'u1' });
    expect(res.status).toBe(401);
  });

  it('accepts authenticated POST /api/trial and returns existing trial', async () => {
    qgroupRepo.findByTitleExact.mockResolvedValue({ id: '00000000-0000-0000-0000-000000000002', passphrase: 'ok' });
    trialRepo.findByUserAndQGroup.mockResolvedValue({ id: '00000000-0000-0000-0000-000000000005', qgroupId: '00000000-0000-0000-0000-000000000002', userId: '00000000-0000-0000-0000-000000000001' });
    const res = await request(app).post('/api/trial').set('Authorization', `Bearer ${token}`).send({ title: 't', passphrase: 'ok', userId: '00000000-0000-0000-0000-000000000001' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('00000000-0000-0000-0000-000000000005');
  });

  it('rejects POST /api/trial with wrong passphrase', async () => {
    qgroupRepo.findByTitleExact.mockResolvedValue({ id: '00000000-0000-0000-0000-000000000002', passphrase: 'ok' });
    const res = await request(app).post('/api/trial').set('Authorization', `Bearer ${token}`).send({ title: 't', passphrase: 'bad', userId: '00000000-0000-0000-0000-000000000001' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});
