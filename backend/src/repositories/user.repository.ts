import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findByName = async (name: string) => {
  return prisma.user.findFirst({ where: { name } });
}

export const findById = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

export const create = async (data: { email: string; passwordHash: string; name: string }) => {
  return prisma.user.create({ data });
};
