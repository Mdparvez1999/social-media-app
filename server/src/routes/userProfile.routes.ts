import { Router } from "express";
import { UserProfileController } from "../controllers/userProfile.controller";
import { auth } from "../middlewares/auth.Middleware";

const router = Router();

const userProfileController = new UserProfileController();

router.get("/profile", auth, userProfileController.getUserProfile);

router.put("/profile", auth, userProfileController.updateUserProfile);

router.patch("/profile/private", auth, userProfileController.privateProfile);

router.put(
  "/profile/change-password",
  auth,
  userProfileController.changePassword
);

export default router;
