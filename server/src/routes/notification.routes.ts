import express from "express";
import { NotificationControllers } from "../controllers/notification.controllers";
import { auth } from "../middlewares/auth.Middleware";

const router: express.Router = express.Router();
const notificationController = new NotificationControllers();

router.get("/", auth, notificationController.getAllNotifications);

router.put("/read/:id", auth, notificationController.readNotification);

router.delete("/delete/:id", auth, notificationController.deleteNotification);

router.put("/read-all", auth, notificationController.readAllNotifications);

router.delete(
  "/delete-all",
  auth,
  notificationController.deleteAllNotifications
);

export default router;
