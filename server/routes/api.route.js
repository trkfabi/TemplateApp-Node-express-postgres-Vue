import { Router } from "express";
import { ApiController } from "../controllers/api.controller.js";
import {
  verifyToken,
  verifySuperAdmin,
} from "../middlewares/jwt.middleware.js";

const router = Router();

router.post("/authenticate", ApiController.authenticate);
router.post("/create", verifyToken, verifySuperAdmin, ApiController.create);
router.get("/", verifyToken, verifySuperAdmin, ApiController.all);

export default router;
