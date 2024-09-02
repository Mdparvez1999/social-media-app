import { AppDataSource } from "../config/DB_Connection.js";
import { Notifications } from "../entities/notification.entity.js";
import { AppError } from "./AppError.js";
export class NotificationUtils {
    static get notificationRepository() {
        return AppDataSource.getRepository(Notifications);
    }
    static async createNotification(type, message, sentBy, receivedBy) {
        const notification = new Notifications();
        notification.type = type;
        notification.message = message;
        notification.sentBy = sentBy;
        notification.receivedBy = receivedBy;
        return await this.notificationRepository.save(notification);
    }
    static async findNotificationById(id) {
        if (!id)
            throw new AppError("Notification id is required", 400);
        const notification = await this.notificationRepository.findOneBy({ id });
        if (!notification) {
            throw new AppError("Notification not found", 404);
        }
        return notification;
    }
}
