import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { verifyToken, verifyAdmin } from "../middlewares/jwt.middleware.js";

const router = Router();

router.post("/refresh-token", UserController.refreshToken);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/logout", verifyToken, UserController.logout);
router.get("/", verifyToken, verifyAdmin, UserController.all);
router.get("/me", verifyToken, UserController.getUserMe);
router.get("/:userId", verifyToken, verifyAdmin, UserController.getUserById);

export default router;
