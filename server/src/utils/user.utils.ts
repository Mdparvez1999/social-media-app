import { AppDataSource } from "../config/DB_Connection";
import { Users } from "../entities/user.entity";
import { AppError } from "./AppError";

export class UserUtils {
  private static get userRepository() {
    return AppDataSource.getRepository(Users);
  }

  public static async findUserById(id: string): Promise<Users> {
    if (!id) throw new AppError("user id is required", 400);

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

  public static async checkEmailExists(email: string) {
    if (!email) throw new AppError("user email is required", 400);

    const userExists = await this.userRepository.findOneBy({ email });

    if (userExists) throw new AppError("Email already exists", 400);
  }

  public static async findUserByEmail(email: string): Promise<Users | null> {
    if (!email) throw new AppError("user email is required", 400);

    const user = await this.userRepository.findOneBy({ email });

    if (!user) throw new AppError(" user not found", 400);

    return user;
  }

  public static async findUserByFPToken(
    forgotPasswordToken: string
  ): Promise<Users> {
    if (!forgotPasswordToken)
      throw new AppError("forgot password token is required", 400);

    const user = await this.userRepository.findOneBy({
      forgotPasswordToken,
    });

    if (!user) {
      throw new AppError("user not found", 404);
    }

    return user;
  }

  public static async checkUserExists(id: string): Promise<void> {
    if (!id) throw new AppError("user id is required", 400);

    const userExists = await this.userRepository.findOneBy({ id });

    if (!userExists) {
      throw new AppError("user not found", 404);
    }
  }
}
