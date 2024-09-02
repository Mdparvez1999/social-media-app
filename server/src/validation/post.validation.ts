import Joi from "joi";

export const postSchema = Joi.object({
  caption: Joi.string().allow("", null).optional().max(800),
}).unknown(true);
