import { Users } from "../entities/user.entity";
import { AppDataSource } from "../config/DB_Connection";
import { Notifications } from "../entities/notification.entity";
import { UserUtils } from "./user.utils";
import { AppError } from "./AppError";

export class NotificationUtils {
  private static get notificationRepository() {
    return AppDataSource.getRepository(Notifications);
  }

  public static async createNotification(
    type: string,
    message: string,
    sentBy: Users,
    receivedBy: Users
  ) {
    const notification = new Notifications();

    notification.type = type;
    notification.message = message;
    notification.sentBy = sentBy;
    notification.receivedBy = receivedBy;

    return await this.notificationRepository.save(notification);
  }

  public static async findNotificationById(id: string): Promise<Notifications> {
    if (!id) throw new AppError("Notification id is required", 400);

    const notification = await this.notificationRepository.findOneBy({ id });

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    return notification;
  }
}
