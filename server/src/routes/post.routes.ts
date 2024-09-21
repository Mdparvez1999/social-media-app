import express from "express";
import { auth } from "../middlewares/auth.Middleware";
import { PostControllers } from "../controllers/post.controllers";

const router: express.Router = express.Router();
const postController = new PostControllers();

router.get("/feed", auth, postController.userFeed);

router.post("/create", auth, postController.createPost);

router.get("/get-all", auth, postController.getAllPosts);

router.get("/get-all/:id", auth, postController.getAllPostsByUserId);

router.get("/user/:id", auth, postController.getPostByIdAndUserId);

router.put("/update/:id", auth, postController.updatePostCaption);

router.delete("/delete/:id", auth, postController.deletePost);

router.get("/:id", auth, postController.getPostById);

router.get("/feed-post/:id", auth, postController.getSingleFeedPost);

router.post("/like/:id", auth, postController.likePost);

router.post("/unlike/:id", auth, postController.unlikePost);

router.get("/post-likes/:id", auth, postController.getPostLikes);

export default router;
