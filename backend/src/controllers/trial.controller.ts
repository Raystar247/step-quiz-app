import { Request, Response, NextFunction } from "express";
import * as trialService from "../services/trial.service";

export const createTrial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const result = await trialService.createOrGetTrial(body);
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getTrial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = (req.query.id as string) ?? undefined;
    const qgroupId = (req.query.qgroupId as string) ?? undefined;
    const userId = (req.query.userId as string) ?? undefined;
    if (id) {
      const t = await trialService.getTrialById(id);
      return res.status(200).json({ success: true, data: t });
    }
    if (qgroupId && userId) {
      const arr = await trialService.findByQGroupAndUser(qgroupId, userId);
      return res.status(200).json({ success: true, data: arr });
    }
    return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Provide id or qgroupId+userId" } });
  } catch (err) {
    next(err);
  }
};
