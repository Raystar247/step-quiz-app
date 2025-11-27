import * as qgroupRepo from "../repositories/qgroup.repository";
import * as trialRepo from "../repositories/trial.repository";

export const createOrGetTrial = async (dto: { title: string; passphrase: string; userId: string }) => {
  // find qgroup by title
  const qgroups = await qgroupRepo.findByTitleExact(dto.title);
  if (!qgroups) {
    const err: any = new Error("QGroup not found");
    err.statusCode = 404;
    err.code = "NOT_FOUND";
    throw err;
  }
  const qgroup = qgroups;
  if (qgroup.passphrase !== dto.passphrase) {
    const err: any = new Error("Passphrase mismatch");
    err.statusCode = 400;
    err.code = "VALIDATION_ERROR";
    throw err;
  }
  const existing = await trialRepo.findByUserAndQGroup(dto.userId, qgroup.id);
  if (existing) return existing;
  // determine index: simple strategy use 1 + count
  const newIndex = 1;
  const created = await trialRepo.create({ qgroupId: qgroup.id, userId: dto.userId, index: newIndex, startTime: new Date() });
  return created;
};

export const getTrialById = async (id: string) => {
  const t = await trialRepo.findById(id);
  if (!t) {
    const err: any = new Error("Trial not found");
    err.statusCode = 404;
    err.code = "NOT_FOUND";
    throw err;
  }
  return t;
};

export const findByQGroupAndUser = async (qgroupId: string, userId: string) => {
  return trialRepo.findByQGroupAndUser(qgroupId, userId);
};
