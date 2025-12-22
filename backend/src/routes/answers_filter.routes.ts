import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import * as answerService from "../services/answer.service";

const router = Router();

router.get("/by-user", authenticate, async (req, res, next) => {
  try {
    const username = req.query.username as string;
    const qgroupId = req.query.qgroupId as string;
    if (!username || !qgroupId) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "username and qgroupId required" } });
    // resolve username -> userId (simple repo call) -- reuse user repository
    const { findByName } = await import("../repositories/user.repository");
    const user = await findByName(username);
    if (!user) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "user not found" } });
    // find trials then answers
    const trialRepo = await import("../repositories/trial.repository");
    const trials = await trialRepo.findByQGroupAndUser(qgroupId, user.id);
    const answers: any[] = [];
    for (const t of trials) {
      const a = await answerService.getAnswers({ trialId: t.id });
      answers.push(...(a as any));
    }
    return res.status(200).json({ success: true, data: answers });
  } catch (err) {
    next(err);
  }
});

router.get("/by-question", authenticate, async (req, res, next) => {
  try {
    const qgroupId = req.query.qgroupId as string;
    const index = Number(req.query.index);
    if (!qgroupId || Number.isNaN(index)) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "qgroupId and index required" } });
    // find question by qgroupId+index
    const questionRepo = await import("../repositories/question.repository");
    const q = await questionRepo.findByQGroupIdAndIndex(qgroupId, index);
    if (!q) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "question not found" } });
    const answers = await answerService.getAnswers({ questionId: q.id });
    return res.status(200).json({ success: true, data: answers });
  } catch (err) {
    next(err);
  }
});

export default router;
