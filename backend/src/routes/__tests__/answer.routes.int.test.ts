import request from 'supertest';
const app = require('../../app').default;
import jwt from 'jsonwebtoken';
import config from '../../config/default';

jest.mock('../../repositories/answer.repository');

const answerRepo = require('../../repositories/answer.repository');

describe('Answer routes (integration)', () => {
  const token = jwt.sign({ userId: '00000000-0000-0000-0000-000000000001' }, config.jwtSecret, { expiresIn: '1h' });

  beforeEach(() => jest.resetAllMocks());

  it('rejects unauthenticated POST /api/answer', async () => {
    const res = await request(app).post('/api/answer').send({ trialId: '00000000-0000-0000-0000-000000000002', questionId: '00000000-0000-0000-0000-000000000003', answer: 'A' });
    expect(res.status).toBe(401);
  });

  it('accepts authenticated POST /api/answer and creates when not duplicate', async () => {
    answerRepo.findByQuestionAndTrial.mockResolvedValue(null);
    answerRepo.create.mockResolvedValue({ id: '00000000-0000-0000-0000-000000000004' });
    const res = await request(app).post('/api/answer').set('Authorization', `Bearer ${token}`).send({ trialId: '00000000-0000-0000-0000-000000000002', questionId: '00000000-0000-0000-0000-000000000003', answer: 'A', score: 0, memo: '' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('00000000-0000-0000-0000-000000000004');
  });

  it('rejects duplicate POST /api/answer with 409', async () => {
    answerRepo.findByQuestionAndTrial.mockResolvedValue({ id: '00000000-0000-0000-0000-000000000004' });
    const res = await request(app).post('/api/answer').set('Authorization', `Bearer ${token}`).send({ trialId: '00000000-0000-0000-0000-000000000002', questionId: '00000000-0000-0000-0000-000000000003', answer: 'A' });
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('accepts PUT /api/answer/:id partial update', async () => {
    answerRepo.findById.mockResolvedValue({ id: '00000000-0000-0000-0000-000000000004', score: 0, scoringStatus: 'pending', memo: '' });
    answerRepo.update.mockResolvedValue({ id: '00000000-0000-0000-0000-000000000004', score: 5, scoringStatus: 'scored', memo: 'ok' });
    const res = await request(app).put('/api/answer/00000000-0000-0000-0000-000000000004').set('Authorization', `Bearer ${token}`).send({ score: 5, scoringStatus: 'scored' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.score).toBe(5);
  });
});
