import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";

const router = Router();

router.post("/checkout-session", verifyToken, PaymentController.createSession);
router.get("/success", PaymentController.success);
router.get("/cancel", PaymentController.cancel);

export default router;
