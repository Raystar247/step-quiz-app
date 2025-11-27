import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAll = async () => prisma.qGroup.findMany();

export const findByTitle = async (title: string) => prisma.qGroup.findMany({ where: { title: { contains: title } } });

export const findById = async (id: string) => prisma.qGroup.findUnique({ where: { id } });

export const findByTitleExact = async (title: string) => prisma.qGroup.findFirst({ where: { title } });

export const create = async (data: { title: string; passphrase: string }) => prisma.qGroup.create({ data });
