import { asyncHandler } from "../utils/asyncHandler.js";
import { AppDataSource } from "../config/DB_Connection.js";
import { Users } from "../entities/user.entity.js";
import { UserUtils } from "../utils/user.utils.js";
export class AdminController {
    get userRepository() {
        return AppDataSource.getRepository(Users);
    }
    getAllUsers = asyncHandler(async (req, res, next) => {
        const allUsers = await this.userRepository.find();
        const users = allUsers.map((user) => {
            return {
                id: user.id,
                userName: user.userName,
                email: user.email,
                DOB: user.DOB,
                role: user.role,
                isPrivate: user.isPrivate,
            };
        });
        if (!users || users.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
            });
        }
        res.status(200).json({
            success: true,
            data: users,
        });
    });
    deleteUser = asyncHandler(async (req, res, next) => {
        const id = req.params.id;
        await UserUtils.findUserById(id);
        await this.userRepository.delete({ id });
        res.status(200).json({
            success: true,
            message: "user deleted successfully",
        });
    });
}
