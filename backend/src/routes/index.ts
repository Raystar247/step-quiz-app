import { Router } from "express";
import userRoutes from "./user.routes";
import questionRoutes from "./question.routes";
import qgroupRoutes from "./qgroup.routes";
import trialRoutes from "./trial.routes";
import answerRoutes from "./answer.routes";
import answersFilterRoutes from "./answers_filter.routes";

const router = Router();

router.use("/user", userRoutes);
router.use("/question", questionRoutes);
router.use("/qgroup", qgroupRoutes);
router.use("/trial", trialRoutes);
router.use("/answer", answerRoutes);
router.use("/answers", answersFilterRoutes);

export default router;
