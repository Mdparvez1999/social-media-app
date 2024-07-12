import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Users } from "../entities/user.entity";
import { UserUtils } from "../utils/user.utils";
import { AppDataSource } from "../config/DB_Connection";
import { Notifications } from "../entities/notification.entity";
import { AppError } from "../utils/AppError";
import { NotificationUtils } from "../utils/notification.utils";

export class NotificationControllers {
  private notificationRepository = AppDataSource.getRepository(Notifications);
  public getAllNotifications = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string = res.locals.user.id;

      const user: Users | null = await UserUtils.findUserById(userId);

      const allNotifications = await this.notificationRepository.find({
        where: { user },
        order: { createdAt: "DESC" },
        relations: { user: true },
      });

      if (!allNotifications || allNotifications.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No notifications found",
          data: [],
        });
      }

      const notifications = allNotifications.map((notification) => {
        return {
          id: notification.id,
          message: notification.message,
          type: notification.type,
          isRead: notification.isRead,
          createdAt: notification.createdAt,
          updatedAt: notification.updatedAt,
          user: {
            id: notification.user.id,
            username: notification.user.userName,
            profilePic: notification.user.profilePic,
          },
        };
      });

      return res.status(200).json({
        success: true,
        message: "Notifications retrieved successfully",
        data: notifications,
      });
    }
  );

  public readNotification = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const notificationId: string = req.params.id;
      const userId: string = res.locals.user.id;

      await UserUtils.checkUserExists(userId);

      const notification = await NotificationUtils.findNotificationById(
        notificationId
      );

      if (notification.user.id !== userId) {
        return next(
          new AppError("You are not authorized to read this notification", 403)
        );
      }

      notification.isRead = true;
      await this.notificationRepository.save(notification);

      return res.status(200).json({
        success: true,
        message: "Notification read successfully",
        data: notification,
      });
    }
  );

  public deleteNotification = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const notificationId: string = req.params.id;
      const userId: string = res.locals.user.id;

      const user: Users | null = await UserUtils.findUserById(userId);

      const notification = await NotificationUtils.findNotificationById(
        notificationId
      );

      if (notification.user.id !== userId && user?.role !== "admin") {
        return next(
          new AppError(
            "You are not authorized to delete this notification",
            403
          )
        );
      }

      await this.notificationRepository.delete({ id: notificationId });
      return res.status(200).json({
        success: true,
        message: "Notification deleted successfully",
      });
    }
  );

  public deleteAllNotifications = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string = res.locals.user.id;

      const user: Users | null = await UserUtils.findUserById(userId);

      const allNotifications = await this.notificationRepository.find({
        where: { user },
      });

      if (!allNotifications || allNotifications.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No notifications found",
          data: [],
        });
      }

      if (
        allNotifications.some(
          (notification) =>
            notification.user.id !== userId && user?.role !== "admin"
        )
      ) {
        return next(
          new AppError(
            "You are not authorized to delete all notifications",
            403
          )
        );
      }

      await this.notificationRepository.delete({ user });
      return res.status(200).json({
        success: true,
        message: "All notifications deleted successfully",
      });
    }
  );

  public readAllNotifications = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId: string = res.locals.user.id;

      const user: Users | null = await UserUtils.findUserById(userId);

      const allNotifications = await this.notificationRepository.find({
        where: { user },
      });

      if (!allNotifications || allNotifications.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No notifications found",
          data: [],
        });
      }

      if (
        allNotifications.some(
          (notification) =>
            notification.user.id !== userId && user?.role !== "admin"
        )
      ) {
        return next(
          new AppError("You are not authorized to read all notifications", 403)
        );
      }

      await this.notificationRepository.update({ user }, { isRead: true });

      return res.status(200).json({
        success: true,
        message: "All notifications read successfully",
        data: allNotifications,
      });
    }
  );
}
