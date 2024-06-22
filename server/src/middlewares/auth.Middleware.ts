import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { verify, JwtPayload } from "jsonwebtoken";
import { AppDataSource } from "../config/DB_Connection";
import { Users } from "../entities/user/user.entity";
import { AppError } from "../utils/AppError";

export const auth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
      return next(new AppError("unauthorized", 401));
    }

    const verifiedToken = verify(token, process.env.JWT_SECRET as string);

    if (!verifiedToken) {
      return next(new AppError("unauthorized", 401));
    }

    const payLoad = verifiedToken as JwtPayload;

    const userRepsitory = AppDataSource.getRepository(Users);

    const user = await userRepsitory
      .createQueryBuilder("user")
      .where("user.id = :id", { id: payLoad.id })
      .select([
        "user.id",
        "user.userName",
        "user.email",
        "user.DOB",
        "user.role",
      ])
      .getOne();

    if (!user) {
      return next(new AppError("unauthorized", 401));
    }

    res.locals.user = user;

    next();
  }
);

export const isAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user: Users = res.locals.user;

    const userRole: string = user.role;

    if (userRole !== "admin") {
      return next(new AppError("unauthorized", 401));
    }

    next();
  }
);
