import jwt, { SignOptions } from "jsonwebtoken";
import { Response } from "express";
import { AppError } from "../utils/AppError";

interface JwtPayload {
  id: string;
}

export const genrateToken = (id: string, res: Response): void => {
  try {
    const jwtPayload: JwtPayload = { id };
    const jwtSecret = process.env.JWT_SECRET as string;
    const signOptions: SignOptions = {
      expiresIn: "1d",
    };

    if (!jwtSecret) {
      throw new AppError("JWT Secret is not defined", 500);
    }

    const token = jwt.sign(jwtPayload, jwtSecret, signOptions);

    res.cookie("jwt", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
  } catch (error) {
    throw new AppError(
      error instanceof Error ? error.message : "Error generating token",
      500
    );
  }
};
