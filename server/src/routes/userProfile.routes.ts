import { Router } from "express";
import {
  changePassword,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userProfile.controller";
import { auth } from "../middlewares/auth.Middleware";

const router = Router();

router.get("/profile", auth, getUserProfile);

router.put("/profile", auth, updateUserProfile);

router.put("/profile/change-password", auth, changePassword);

export default router;
