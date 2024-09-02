import express from "express";
import { CommentsController } from "../controllers/comment.controllers.js";
import { auth } from "../middlewares/auth.Middleware.js";
const router = express.Router();
const commentsController = new CommentsController();
router.post("/write/:id", auth, commentsController.writeComment);
router.put("/edit/:id", auth, commentsController.editComment);
router.delete("/delete/:id", auth, commentsController.deleteComment);
router.get("/get-all/:id", auth, commentsController.getAllComments);
export default router;
