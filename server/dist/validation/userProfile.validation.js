import joi from "joi";
export const updateUserNameSchema = joi.object({
    userName: joi.string().required().min(3).max(30),
});
export const updatefullNameSchema = joi.object({
    fullName: joi.string().required().min(3).max(30),
});
export const updateEmailSchema = joi.object({
    email: joi
        .string()
        .email()
        .required()
        .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
});
export const updateDOBSchema = joi.object({
    DOB: joi.string().required(),
});
export const updateBioSchema = joi.object({
    bio: joi.string().min(0).required(),
});
export const updateGenderSchema = joi.object({
    gender: joi.string().required(),
});
export const changePasswordSchema = joi.object({
    oldPassword: joi.string().required().min(8).max(15),
    newPassword: joi.string().required().min(8).max(15),
});
