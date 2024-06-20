import express from "express";
import {
  forgotPassword,
  resetPassword,
  userLogin,
  userRegister,
} from "../controllers/auth.controllers";

const router: express.Router = express.Router();

router.post("/register", userRegister);

router.post("/login", userLogin);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export default router;
