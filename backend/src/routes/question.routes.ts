import { Router } from "express";
import * as questionController from "../controllers/question.controller";
import { validate } from "../middlewares/validation.middleware";
import { questionSearchSchema, questionIdSchema, questionCreateSchema } from "../validators/question.validator";

const router = Router();

router.get("/", validate(questionSearchSchema), questionController.searchQuestions);
router.get("/:id", validate(questionIdSchema), questionController.getQuestionById);
router.post("/", validate(questionCreateSchema), questionController.createQuestion);

export default router;
