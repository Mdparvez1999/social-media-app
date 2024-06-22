import express from "express";
import { AuthController } from "../controllers/auth.controllers";

const router: express.Router = express.Router();

const authController = new AuthController();

router.post("/register", authController.userRegister);

router.post("/login", authController.userLogin);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password/:token", authController.resetPassword);

export default router;
