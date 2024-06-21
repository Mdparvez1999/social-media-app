import joi from "joi";

export const updateProfileSchema = joi.object({
  userName: joi.string().required().min(3).max(30),
  email: joi.string().email().required(),
  DOB: joi.string().required(),
});

export const changePasswordSchema = joi.object({
  oldPassword: joi.string().required().min(8).max(15),
  newPassword: joi.string().required().min(8).max(15),
});
