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

router.get("/get-all/:id", auth, postController.getAllPostsByUserId);

router.put("/update/:id", auth, postController.updatePostCaption);

router.delete("/delete/:id", auth, postController.deletePost);

router.get("/:id", auth, postController.getPostById);

router.get("/user/:id", auth, postController.getPostByIdAndUserId);

router.post("/like/:id", auth, postController.likePost);

router.post("/unlike/:id", auth, postController.unlikePost);

router.get("/post-likes/:id", auth, postController.getPostLikes);

export default router;
