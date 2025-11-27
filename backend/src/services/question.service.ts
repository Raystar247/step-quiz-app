import * as questionRepo from "../repositories/question.repository";

export const getQuestionsByQGroup = async (qgroupId: string) => {
  const items = await questionRepo.findByQGroupId(qgroupId);
  return items.map((it) => ({
    id: it.id,
    qgroupId: it.qgroupId,
    index: it.index,
    description: it.description,
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
  return { id: it.id, qgroupId: it.qgroupId, index: it.index, description: it.description, correctAnswer: it.correctAnswer };
};

export const getQuestionById = async (id: string) => {
  const it = await questionRepo.findById(id);
  if (!it) {
    const err: any = new Error("Question not found");
    err.statusCode = 404;
    err.code = "NOT_FOUND";
    throw err;
  }
  return { id: it.id, qgroupId: it.qgroupId, index: it.index, description: it.description, correctAnswer: it.correctAnswer };
};

export const createQuestion = async (dto: { qgroupId: string; index: number; description: string; correctAnswer: string }) => {
  // check duplicates by qgroupId+index
  const existing = await questionRepo.findByQGroupIdAndIndex(dto.qgroupId, dto.index);
  if (existing) {
    const err: any = new Error("Question index already exists in qgroup");
    err.statusCode = 409;
    err.code = "CONFLICT";
    throw err;
  }
  const created = await questionRepo.create(dto);
  return { id: created.id, qgroupId: created.qgroupId, index: created.index, description: created.description, correctAnswer: created.correctAnswer };
};
