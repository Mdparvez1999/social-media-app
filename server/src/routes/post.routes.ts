import express from "express";
import { auth } from "../middlewares/auth.Middleware";
import { PostControllers } from "../controllers/post.controllers";
import { postFilesUpload } from "../config/multer.config";

const router: express.Router = express.Router();

const postController = new PostControllers();

router.post(
  "/create",
  auth,
  postFilesUpload.array("files"),
  postController.createPost
);

router.get("/get-all", auth, postController.getAllPosts);

router.put("/update-post/:id", auth, postController.updatePostCaption);

router.delete("/delete-post/:id", auth, postController.deletePost);

router.get("/get-post/:id", auth, postController.getPostById);

router.post("/like-post/:id", auth, postController.likePost);

router.post("/unlike-post/:id", auth, postController.unlikePost);

router.get("/post-likes/:id", auth, postController.getPostLikes);

export default router;
