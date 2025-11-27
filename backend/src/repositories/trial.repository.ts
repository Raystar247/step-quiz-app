import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findByUserAndQGroup = async (userId: string, qgroupId: string) => {
  return prisma.trial.findFirst({ where: { userId, qgroupId } });
};

export const findById = async (id: string) => prisma.trial.findUnique({ where: { id } });

export const findByQGroupAndUser = async (qgroupId: string, userId: string) => prisma.trial.findMany({ where: { qgroupId, userId } });

export const create = async (data: { qgroupId: string; userId: string; index: number; startTime: Date }) => {
  return prisma.trial.create({ data });
};
