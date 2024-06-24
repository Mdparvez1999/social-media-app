import Joi from "joi";

export const postSchema = Joi.object({
  caption: Joi.string(),
});
