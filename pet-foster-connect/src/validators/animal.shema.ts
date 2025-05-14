import Joi from "joi";

export const animalFormSchema = Joi.object({
  name: Joi.string().trim().min(3).required().messages({
    "string.empty": "Le nom est requis.",
    "string.min": "Le nom doit contenir au moins 3 caractères.",
  }),
  birthday: Joi.string().trim().required().messages({
    "string.empty": "La date de naissance est requise.",
  }),
  description: Joi.string().trim().min(10).required().messages({
    "string.empty": "La description est requise.",
    "string.min": "La description doit contenir au moins 10 caractères.",
  }),
  picture: Joi.string().trim().required().messages({
    "string.empty": "L'image est requise.",
  }),
  species_id: Joi.number().required().messages({
    "any.required": "L'espèce est requise.",
    "number.base": "L'espèce est requise.",
  }),
  localisation_id: Joi.number().required().messages({
    "any.required": "La localisation est requise.",
    "number.base": "La localisation est requise.",
  }),
});
