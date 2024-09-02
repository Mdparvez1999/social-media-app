import express from "express";
import { FollowController } from "../controllers/follow.controller";
import { auth } from "../middlewares/auth.Middleware";

const router: express.Router = express.Router();
const followController = new FollowController();

router.post("/follow/:id", auth, followController.followUser);

router.delete("/unfollow/:id", auth, followController.unfollowUser);

router.get("/followers/:id", auth, followController.getFollowers);

router.get("/following/:id", auth, followController.getFollowing);

router.get("/follow-requests", auth, followController.getFollowRequests);

router.get("/sent-requests/:id", auth, followController.getSentRequests);

router.post("/accept-request/:id", auth, followController.acceptFollowRequest);

router.delete(
  "/cancel-request/:id",
  auth,
  followController.cancelFollowRequest
);

router.delete(
  "/decline-request/:id",
  auth,
  followController.declineFollowRequest
);

router.get("/search", auth, followController.searchUsers);

router.get("/profile/:id", auth, followController.getUsersProfileById);

export default router;
