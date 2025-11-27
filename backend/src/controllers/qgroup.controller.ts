import { Request, Response, NextFunction } from "express";
import * as qgroupService from "../services/qgroup.service";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const title = (req.query.title as string) ?? undefined;
    if (title) {
      const items = await qgroupService.findByTitle(title);
      return res.status(200).json({ success: true, data: items });
    }
    const all = await qgroupService.listQGroups();
    return res.status(200).json({ success: true, data: all });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.query.qgroupId as string ?? req.params.id;
    const item = await qgroupService.getById(id);
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};
