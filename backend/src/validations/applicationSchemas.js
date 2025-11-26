import Joi from "joi";

export const createApplicationSchema = Joi.object({
  message: Joi.string().min(10).max(500).required().messages({
    "string.empty": "Le message est requis.",
    "string.min": "Le message doit contenir au moins 10 caractères.",
    "string.max": "Le message ne doit pas dépasser 500 caractères.",
    "any.required": "Le message est requis.",
  }),
});