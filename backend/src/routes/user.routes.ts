import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { validate } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { signUpSchema, signInSchema } from "../validators/user.validator";

const router = Router();

router.post("/signup", validate(signUpSchema), userController.signUp);
router.post("/signin", validate(signInSchema), userController.signIn);
router.get("/:id", authenticate, userController.getUserInfo);

export default router;
