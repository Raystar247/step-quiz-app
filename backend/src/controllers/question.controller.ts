import { Request, Response, NextFunction } from "express";
import * as questionService from "../services/question.service";

export const searchQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const qgroupId = (req.query.qgroupId as string) ?? undefined;
    const index = req.query.index ? Number(req.query.index) : undefined;
    if (!qgroupId) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "qgroupId is required" } });
    }
    if (typeof index === "number" && !Number.isInteger(index)) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "index must be integer" } });
    }
    if (index !== undefined) {
      const question = await questionService.getQuestionByQGroupAndIndex(qgroupId, index);
      return res.status(200).json({ success: true, data: question });
    }
    const questions = await questionService.getQuestionsByQGroup(qgroupId);
    return res.status(200).json({ success: true, data: questions });
  } catch (err) {
    next(err);
  }
};

export const getQuestionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const question = await questionService.getQuestionById(id);
    return res.status(200).json({ success: true, data: question });
  } catch (err) {
    next(err);
  }
};

export const createQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const created = await questionService.createQuestion(body);
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
};
