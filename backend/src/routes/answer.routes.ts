import { Router } from "express";
import * as answerController from "../controllers/answer.controller";
import { validate } from "../middlewares/validation.middleware";
import { postAnswerSchema, answerQuerySchema, answerUpdateSchema } from "../validators/answer.validator";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, validate(postAnswerSchema), answerController.postAnswer);
router.get("/", authenticate, validate(answerQuerySchema), answerController.getAnswers);
router.put("/:id", authenticate, validate(answerUpdateSchema), answerController.updateAnswer);

export default router;
