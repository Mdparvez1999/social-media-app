import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppDataSource } from "../config/DB_Connection";
import { Users } from "../entities/user.entity";
import { AppError } from "../utils/AppError";

export const auth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
      return next(new AppError("unauthorized", 401));
    }

    try {
      const JWT_SECRET = process.env.JWT_SECRET;

      if (!JWT_SECRET) throw new AppError("JWT Secret is not defined", 500);

      const verifiedToken = jwt.verify(token, JWT_SECRET);

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
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unauthorized access";
      return next(new AppError(message, 401));
    }
  }
);

export const isAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user: Users = res.locals.user;

    if (user.role !== "admin") {
      return next(new AppError("unauthorized : admins only", 403));
    }

    next();
  }
);
