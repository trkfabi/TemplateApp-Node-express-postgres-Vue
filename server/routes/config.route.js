import { Router } from "express";
import { ConfigController } from "../controllers/config.controller.js";
import { verifyToken, verifyAdmin } from "../middlewares/jwt.middleware.js";

const router = Router();

router.post("/create", verifyToken, ConfigController.create);
router.delete("/:key", verifyToken, ConfigController.delete);
router.patch("/:key", verifyToken, ConfigController.update);
router.get("/", verifyToken, ConfigController.all);

export default router;
