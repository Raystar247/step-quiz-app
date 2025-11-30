import * as questionRepo from "../repositories/question.repository";

export const getQuestionsByQGroup = async (qgroupId: string) => {
  const items = await questionRepo.findByQGroupId(qgroupId);
  return items.map((it) => ({
    id: it.id,
    qgroupId: it.qgroupId,
    index: it.index,
    description: it.description ?? it.questionText,
    questionText: it.questionText,
    correctAnswer: it.correctAnswer
  }));
};

export const getQuestionByQGroupAndIndex = async (qgroupId: string, index: number) => {
  const it = await questionRepo.findByQGroupIdAndIndex(qgroupId, index);
  if (!it) {
    const err: any = new Error("Question not found");
    err.statusCode = 404;
    err.code = "NOT_FOUND";
    throw err;
  }
  return { id: it.id, qgroupId: it.qgroupId, index: it.index, description: it.description ?? it.questionText, questionText: it.questionText, correctAnswer: it.correctAnswer };
};

export const getQuestionById = async (id: string) => {
  const it = await questionRepo.findById(id);
  if (!it) {
    const err: any = new Error("Question not found");
    err.statusCode = 404;
    err.code = "NOT_FOUND";
    throw err;
  }
  return { id: it.id, qgroupId: it.qgroupId, index: it.index, description: it.description ?? it.questionText, questionText: it.questionText, correctAnswer: it.correctAnswer };
};

export const createQuestion = async (dto: { qgroupId: string; index: number; description?: string; questionText: string; correctAnswer: string }) => {
  // check duplicates by qgroupId+index
  const existing = await questionRepo.findByQGroupIdAndIndex(dto.qgroupId, dto.index);
  if (existing) {
    const err: any = new Error("Question index already exists in qgroup");
    err.statusCode = 409;
    err.code = "CONFLICT";
    throw err;
  }
  const description = dto.description ?? dto.questionText;
  const created = await questionRepo.create({ qgroupId: dto.qgroupId, index: dto.index, questionText: dto.questionText, description, correctAnswer: dto.correctAnswer });
  return { id: created.id, qgroupId: created.qgroupId, index: created.index, description: created.description ?? created.questionText, questionText: created.questionText, correctAnswer: created.correctAnswer };
};
