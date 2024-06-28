import express from "express";
import { FollowController } from "../controllers/follow.controller";
import { auth } from "../middlewares/auth.Middleware";

const router: express.Router = express.Router();

const followController = new FollowController();

router.post("/follow/:id", auth, followController.followUser);

router.delete("/unfollow/:id", auth, followController.unfollowUser);

router.get("/followers", auth, followController.getFollowers);

router.get("/following", auth, followController.getFollowing);

router.get("/follow-requests", auth, followController.getFollowRequests);

router.put("/accept-request/:id", auth, followController.acceptFollowRequest);

router.delete(
  "/cancel-request/:id",
  auth,
  followController.cancelFollowRequest
);

router.delete(
  "/delete-request/:id",
  auth,
  followController.declineFollowRequest
);

export default router;
