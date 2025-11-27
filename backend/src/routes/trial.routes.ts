import { Router } from "express";
import * as trialController from "../controllers/trial.controller";
import { validate } from "../middlewares/validation.middleware";
import { trialCreateSchema, trialQuerySchema } from "../validators/trial.validator";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, validate(trialCreateSchema), trialController.createTrial);
router.get("/", authenticate, validate(trialQuerySchema), trialController.getTrial);
router.get("/:id", authenticate, trialController.getTrial);

export default router;
