import express from "express";
import { AwsS3Controllers } from "../controllers/awsS3.controllers";
import { auth } from "../middlewares/auth.Middleware";

const router: express.Router = express.Router();
const awsS3Controller = new AwsS3Controllers();

router.post(
  "/create-put-object-url",
  auth,
  awsS3Controller.createPutObjectUrlForPosts
);

router.post(
  "/create-get-object-url",
  auth,
  awsS3Controller.createGetObjectUrlForPosts
);

router.post(
  "/create-put-object-url-profile-pic",
  auth,
  awsS3Controller.createPutObjectUrlForProfilePic
);

router.post(
  "/create-get-object-url-profile-pic",
  auth,
  awsS3Controller.createGetObjectUrlForProfilePic
);

router.post(
  "/create-get-object-url-all-profile-pics",
  auth,
  awsS3Controller.createGetObjectUrlForAllProfilePics
);

export default router;
