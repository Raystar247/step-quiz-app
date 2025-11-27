import * as qgroupRepo from "../repositories/qgroup.repository";

export const listQGroups = async () => {
  return qgroupRepo.findAll();
};

export const findByTitle = async (title: string) => {
  return qgroupRepo.findByTitle(title);
};

export const getById = async (id: string) => {
  const it = await qgroupRepo.findById(id);
  if (!it) {
    const err: any = new Error("QGroup not found");
    err.statusCode = 404;
    err.code = "NOT_FOUND";
    throw err;
  }
  return it;
};
