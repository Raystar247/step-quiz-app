import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const create = async (data: { trialId: string; questionId: string; answer: string; score: number; memo: string }) => {
  return prisma.answer.create({ data });
};

export const findByTrialId = async (trialId: string) => prisma.answer.findMany({ where: { trialId } });

export const findByQGroupAndTrial = async (qgroupId: string, trialId: string) => prisma.answer.findMany({ where: { trialId }, include: { trial: true } });

export const findByQGroupAndQuestion = async (qgroupId: string, questionId: string) => prisma.answer.findMany({ where: { questionId }, include: { question: true } });

export const findById = async (id: string) => prisma.answer.findUnique({ where: { id } });

export const update = async (id: string, data: any) => prisma.answer.update({ where: { id }, data });

export const findByQuestionAndTrial = async (questionId: string, trialId: string) => prisma.answer.findFirst({ where: { questionId, trialId } });
