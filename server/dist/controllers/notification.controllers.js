import { asyncHandler } from "../utils/asyncHandler.js";
import { UserUtils } from "../utils/user.utils.js";
import { AppDataSource } from "../config/DB_Connection.js";
import { Notifications } from "../entities/notification.entity.js";
import { AppError } from "../utils/AppError.js";
import { NotificationUtils } from "../utils/notification.utils.js";
export class NotificationControllers {
    get notificationRepository() {
        return AppDataSource.getRepository(Notifications);
    }
    getAllNotifications = asyncHandler(async (req, res, next) => {
        const userId = res.locals.user.id;
        const user = await UserUtils.findUserById(userId);
        const allNotifications = await this.notificationRepository
            .createQueryBuilder("notification")
            .leftJoinAndSelect("notification.sentBy", "sentBy")
            .leftJoinAndSelect("notification.receivedBy", "receivedBy")
            .where("notification.receivedBy.id = :userId", { userId })
            .orderBy("notification.createdAt", "DESC")
            .getMany();
        const notifications = allNotifications.map((notification) => {
            return {
                id: notification.id,
                message: notification.message,
                type: notification.type,
                isRead: notification.isRead,
                createdAt: notification.createdAt,
                updatedAt: notification.updatedAt,
                sentBy: {
                    id: notification.sentBy.id,
                    username: notification.sentBy.userName,
                    profilePic: notification.sentBy.profilePic,
                },
                receivedBy: {
                    id: notification.receivedBy.id,
                    username: notification.receivedBy.userName,
                    profilePic: notification.receivedBy.profilePic,
                },
            };
        });
        return res.status(200).json({
            success: true,
            message: allNotifications.length > 0
                ? "Notifications retrieved successfully"
                : "No notifications found",
            data: notifications || [],
        });
    });
    readNotification = asyncHandler(async (req, res, next) => {
        const notificationId = req.params.id;
        const userId = res.locals.user.id;
        // Check if the user exists
        await UserUtils.checkUserExists(userId);
        // Find the notification by ID
        const notification = await NotificationUtils.findNotificationById(notificationId);
        // Check if the notification was received by the current user
        if (notification.receivedBy.id !== userId) {
            return next(new AppError("You are not authorized to read this notification", 403));
        }
        // Mark the notification as read
        notification.isRead = true;
        await this.notificationRepository.save(notification);
        return res.status(200).json({
            success: true,
            message: "Notification read successfully",
            data: {
                id: notification.id,
                message: notification.message,
                type: notification.type,
                isRead: notification.isRead,
                createdAt: notification.createdAt,
                updatedAt: notification.updatedAt,
                sentBy: {
                    id: notification.sentBy.id,
                    username: notification.sentBy.userName,
                    profilePic: notification.sentBy.profilePic,
                },
                receivedBy: {
                    id: notification.receivedBy.id,
                    username: notification.receivedBy.userName,
                    profilePic: notification.receivedBy.profilePic,
                },
            },
        });
    });
    deleteNotification = asyncHandler(async (req, res, next) => {
        const notificationId = req.params.id;
        const userId = res.locals.user.id;
        // Find the user
        const user = await UserUtils.findUserById(userId);
        // Find the notification by ID
        const notification = await NotificationUtils.findNotificationById(notificationId);
        // Check if the user is authorized to delete the notification
        if (notification.receivedBy.id !== userId && user.role !== "admin") {
            return next(new AppError("You are not authorized to delete this notification", 403));
        }
        // Delete the notification
        await this.notificationRepository.delete({ id: notificationId });
        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully",
        });
    });
    deleteAllNotifications = asyncHandler(async (req, res, next) => {
        const userId = res.locals.user.id;
        // Find the user
        const user = await UserUtils.findUserById(userId);
        // Find all notifications received by the user
        const allNotifications = await this.notificationRepository.find({
            where: { receivedBy: user },
        });
        if (!allNotifications || allNotifications.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No notifications found",
                data: [],
            });
        }
        // Check if any notification is not received by the user and the user is not an admin
        if (allNotifications.some((notification) => notification.receivedBy.id !== userId && user.role !== "admin")) {
            return next(new AppError("You are not authorized to delete all notifications", 403));
        }
        // Delete all notifications received by the user
        await this.notificationRepository.delete({ receivedBy: user });
        return res.status(200).json({
            success: true,
            message: "All notifications deleted successfully",
        });
    });
    readAllNotifications = asyncHandler(async (req, res, next) => {
        const userId = res.locals.user.id;
        // Find the user
        const user = await UserUtils.findUserById(userId);
        // Find all notifications received by the user
        const allNotifications = await this.notificationRepository.find({
            where: { receivedBy: user },
        });
        if (!allNotifications || allNotifications.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No notifications found",
                data: [],
            });
        }
        // Check if any notification is not received by the user and the user is not an admin
        if (allNotifications.some((notification) => notification.receivedBy.id !== userId && user.role !== "admin")) {
            return next(new AppError("You are not authorized to read all notifications", 403));
        }
        // Mark all notifications as read
        await this.notificationRepository.update({ receivedBy: user }, { isRead: true });
        return res.status(200).json({
            success: true,
            message: "All notifications read successfully",
            data: allNotifications,
        });
    });
}
