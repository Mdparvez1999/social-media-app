import express from "express";
import { AuthController } from "../controllers/auth.controllers";
import { profilePicUpload } from "../config/multer.config";

const router: express.Router = express.Router();
const authController = new AuthController();

router.post(
  "/register",
  profilePicUpload.single("profilePic"),
  authController.userRegister
);

router.post("/login", authController.userLogin);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password/:token", authController.resetPassword);

router.post("/logout", authController.userLogout);

export default router;
