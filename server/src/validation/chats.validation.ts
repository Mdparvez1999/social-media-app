import joi from "joi";

export const sendMessage = joi.object({
  message: joi.string().min(1).max(4096).required(),
});
