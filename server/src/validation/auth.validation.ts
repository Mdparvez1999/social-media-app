import joi from "joi";

export const registerSchema = joi.object({
  userName: joi.string().required().min(3).max(30),
  email: joi.string().email().required(),
  password: joi.string().required().min(8).max(15),
});

export const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required().min(8).max(15),
});

export const forgotPasswordSchema = joi.object({
  email: joi.string().email().required(),
});

export const resetPasswordSchema = joi.object({
  password: joi.string().required().min(8).max(15),
});
