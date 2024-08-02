import express from "express";
import { UserProfileController } from "../controllers/userProfile.controller";
import { auth } from "../middlewares/auth.Middleware";
import { profilePicUpload } from "../config/multer.config";

const router: express.Router = express.Router();

const userProfileController = new UserProfileController();

router.get("/", auth, userProfileController.getUserProfile);

router.patch("/username", auth, userProfileController.updateUserName);

router.patch("/fullname", auth, userProfileController.updateFullName);

router.patch("/email", auth, userProfileController.updateEmail);

router.patch("/DOB", auth, userProfileController.updateDOB);

router.patch("/bio", auth, userProfileController.updateBio);

router.patch("/gender", auth, userProfileController.updateGender);

router.patch(
  "/profilePic",
  auth,
  profilePicUpload.single("profilePic"),
  userProfileController.updateProfilePic
);

router.put("/change-password", auth, userProfileController.changePassword);

router.patch("/private", auth, userProfileController.privateProfile);

router.patch("/public", auth, userProfileController.publicProfile);

router.patch("/deactivate", auth, userProfileController.deActivateProfile);

router.patch("/reactivate", auth, userProfileController.reActivateProfile);

router.delete("/", auth, userProfileController.deleteProfile);

router.get("/suggested-users", auth, userProfileController.suggestedUsers);

export default router;
