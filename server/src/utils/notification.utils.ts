import { Users } from "../entities/user.entity";
import { AppDataSource } from "../config/DB_Connection";
import { Notifications } from "../entities/notification.entity";
import { UserUtils } from "./user.utils";
import { AppError } from "./AppError";

export class NotificationUtils {
  private static notificationRepository =
    AppDataSource.getRepository(Notifications);

  public static async createNotification(
    type: string,
    message: string,
    id: string
  ) {
    const user: Users | null = await UserUtils.findUserById(id);
    const notification = new Notifications();
    notification.type = type;
    notification.message = message;
    notification.user = user;
    return this.notificationRepository.save(notification);
  }

  public static async findNotificationById(id: string): Promise<Notifications> {
    const notification = await this.notificationRepository.findOneBy({ id });

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    return notification;
  }
}
