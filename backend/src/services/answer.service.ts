import * as answerRepo from "../repositories/answer.repository";

export const postAnswer = async (dto: { trialId: string; questionId: string; answer: string; score?: number; memo?: string }) => {
  // prevent duplicate by question+trial
  const existing = await answerRepo.findByQuestionAndTrial(dto.questionId, dto.trialId);
  if (existing) {
    const err: any = new Error("Answer already exists");
    err.statusCode = 409;
    err.code = "CONFLICT";
    throw err;
  }
  const created = await answerRepo.create({ trialId: dto.trialId, questionId: dto.questionId, answer: dto.answer, score: dto.score ?? 0, memo: dto.memo ?? "" });
  return { id: created.id };
};

export const getAnswers = async (query: { trialId?: string; qgroupId?: string; questionId?: string }) => {
  if (query.trialId) return answerRepo.findByTrialId(query.trialId);
  if (query.qgroupId && query.questionId) return answerRepo.findByQGroupAndQuestion(query.qgroupId, query.questionId);
  if (query.qgroupId && query.trialId) return answerRepo.findByQGroupAndTrial(query.qgroupId, query.trialId);
  return [];
};

export const updateAnswer = async (id: string, data: any) => {
  const exist = await answerRepo.findById(id);
  if (!exist) {
    const err: any = new Error("Answer not found");
    err.statusCode = 404;
    err.code = "NOT_FOUND";
    throw err;
  }
  const allowed: any = {};
  if (data.score !== undefined) allowed.score = data.score;
  if (data.scoringStatus !== undefined) allowed.scoringStatus = data.scoringStatus;
  if (data.memo !== undefined) allowed.memo = data.memo;
  const updated = await answerRepo.update(id, allowed);
  return updated;
};
