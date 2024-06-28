import { sign } from "jsonwebtoken";
import { Response } from "express";

export const genrateToken = (id: string, res: Response): void => {
  const token = sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
};
