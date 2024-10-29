import { Router } from "express";
import { ApiController } from "../controllers/api.controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";

const router = Router();

router.post("/authenticate", ApiController.authenticate);

export default router;
