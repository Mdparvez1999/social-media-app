import { AppDataSource } from "../config/DB_Connection.js";
import { Users } from "../entities/user.entity.js";
import { AppError } from "./AppError.js";
export class UserUtils {
    static get userRepository() {
        return AppDataSource.getRepository(Users);
    }
    static async findUserById(id) {
        if (!id)
            throw new AppError("user id is required", 400);
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
    static async findUserByEmail(email) {
        if (!email)
            throw new AppError("user email is required", 400);
        const user = await this.userRepository.findOneBy({ email });
        if (!user) {
            throw new AppError("user not found", 404);
        }
        return user;
    }
    static async findUserByFPToken(forgotPasswordToken) {
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
    static async checkUserExists(id) {
        if (!id)
            throw new AppError("user id is required", 400);
        const userExists = await this.userRepository.findOneBy({ id });
        if (!userExists) {
            throw new AppError("user not found", 404);
        }
    }
}
