import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findByQGroupId = async (qgroupId: string) => {
  return prisma.question.findMany({ where: { qgroupId }, orderBy: { index: 'asc' } });
};

export const findByQGroupIdAndIndex = async (qgroupId: string, index: number) => {
  return prisma.question.findFirst({ where: { qgroupId, index } });
};

export const findById = async (id: string) => {
  return prisma.question.findUnique({ where: { id } });
};

export const create = async (data: { qgroupId: string; index: number; questionText: string; description?: string; correctAnswer: string }) => {
  return prisma.question.create({ data });
};
