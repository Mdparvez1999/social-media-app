import express from "express";
import { CommentsController } from "../controllers/comment.controllers";
import { auth } from "../middlewares/auth.Middleware";

const router: express.Router = express.Router();

const commentsController = new CommentsController();

router.post("/write/:id", auth, commentsController.writeComment);

router.put("/edit/:id", auth, commentsController.editComment);

router.delete("/delete/:id", auth, commentsController.deleteComment);

router.get("/get-all/:id", auth, commentsController.getAllComments);

export default router;
