jest.mock('../../repositories/answer.repository', () => ({
  findByQuestionAndTrial: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
}));

const answerRepo = require('../../repositories/answer.repository') as any;
const answerService = require('../answer.service') as any;

describe('AnswerService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('postAnswer', () => {
    it('throws when duplicate exists', async () => {
      answerRepo.findByQuestionAndTrial.mockResolvedValue({ id: 'a1' });
      await expect(answerService.postAnswer({ questionId: 'q', trialId: 't', answer: 'x' })).rejects.toMatchObject({ code: 'CONFLICT' });
    });

    it('creates when not exists', async () => {
      answerRepo.findByQuestionAndTrial.mockResolvedValue(null);
      answerRepo.create.mockResolvedValue({ id: 'a2' });
      const res = await answerService.postAnswer({ questionId: 'q', trialId: 't', answer: 'x' });
      expect(res).toEqual({ id: 'a2' });
    });
  });

  describe('updateAnswer', () => {
    it('throws when not found', async () => {
      answerRepo.findById.mockResolvedValue(null);
      await expect(answerService.updateAnswer('nope', { score: 1 })).rejects.toMatchObject({ code: 'NOT_FOUND' });
    });

    it('updates only allowed fields', async () => {
      answerRepo.findById.mockResolvedValue({ id: 'a1', score: 0, memo: '', scoringStatus: null });
      answerRepo.update.mockImplementation((id: string, data: any) => Promise.resolve({ id, ...data }));
      const updated = await answerService.updateAnswer('a1', { score: 5, memo: 'ok', extra: 'ignored' });
      expect(updated).toMatchObject({ id: 'a1', score: 5, memo: 'ok' });
      // ensure update was called with only allowed fields
      expect(answerRepo.update.mock.calls[0][1]).toEqual({ score: 5, memo: 'ok' });
    });
  });
});
