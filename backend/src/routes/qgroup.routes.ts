import { Router } from "express";
import * as qgroupController from "../controllers/qgroup.controller";

const router = Router();

router.get("/", qgroupController.list);
router.get("/:id", qgroupController.getById);

export default router;
