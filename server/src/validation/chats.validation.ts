import joi from "joi";

export const sendMessage = joi.object({
  message: joi.string().required(),
});
