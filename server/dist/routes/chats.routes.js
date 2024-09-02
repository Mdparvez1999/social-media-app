import express from "express";
import { ChatsController } from "../controllers/chats.controllers.js";
import { auth } from "../middlewares/auth.Middleware.js";
const router = express.Router();
const chatsController = new ChatsController();
router.get("/conversations", auth, chatsController.getAllConversations);
router.post("/send-message/:recieverId", auth, chatsController.sendMessage);
router.get("/all-messages/:conversationId", auth, chatsController.getAllMessages);
export default router;
