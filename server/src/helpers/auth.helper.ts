import { compare, genSalt, hash } from "bcrypt";
import crypto from "crypto";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
};

export const comparePassword = async (
  password: string,
  dbPassword: string
): Promise<boolean> => {
  return await compare(password, dbPassword);
};

export const genForgotPasswordToken = (): string => {
  return crypto.randomBytes(20).toString("hex");
};
