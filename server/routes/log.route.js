import { Router } from "express";
import { LogController } from "../controllers/log.controller.js";
import { verifyToken, verifyAdmin } from "../middlewares/jwt.middleware.js";

const router = Router();

router.get("/", verifyToken, verifyAdmin, LogController.all);

export default router;
