import Joi from "joi";

export const postSchema = Joi.object({
  caption: Joi.string().allow("", null).optional().max(800),
  files: Joi.array().items(Joi.string()).optional(),
}).unknown(true);
