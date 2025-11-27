import { Request, Response, NextFunction } from "express";
import * as answerService from "../services/answer.service";

export const postAnswer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const result = await answerService.postAnswer(body);
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getAnswers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { trialId, qgroupId, questionId } = req.query as any;
    const items = await answerService.getAnswers({ trialId, qgroupId, questionId });
    return res.status(200).json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

export const updateAnswer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const updated = await answerService.updateAnswer(id, body);
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
