import { AppDataSource } from "../config/DB_Connection";
import { Users } from "../entities/user.entity";
import { AppError } from "./AppError";

export class UserUtils {
  private static userRepository = AppDataSource.getRepository(Users);

  public static async findUserById(id: string): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: ["following"],
    });

    if (!user) {
      throw new AppError("user not found", 404);
    }

    return user;
  }

  public static async findUserByEmail(email: string): Promise<Users> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new AppError("user not found", 404);
    }

    return user;
  }

  public static async findUserByFPToken(
    forgotPasswordToken: string
  ): Promise<Users> {
    const user = await this.userRepository.findOneBy({
      forgotPasswordToken,
    });

    if (!user) {
      throw new AppError("user not found", 404);
    }

    return user;
  }

  public static async checkUserExists(id: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new AppError("user not found", 404);
    }
  }
}
