import Joi from "joi";
import { passwordComplexity, updatedPasswordComplexity } from "./password.js";

export const userRegisterSchema = Joi.object({
  first_name: Joi.string().min(3).max(30).required().messages({
    "string.base": "Le prénom doit être une chaîne de caractères.",
    "string.empty": "Le prénom est requis.",
    "string.min": "Le prénom doit contenir au moins 3 caractères.",
    "string.max": "Le prénom doit contenir au maximum 30 caractères.",
  }),
  last_name: Joi.string().min(3).max(30).required().messages({
    "string.base": "Le nom doit être une chaîne de caractères.",
    "string.empty": "Le nom est requis.",
    "string.min": "Le nom doit contenir au moins 3 caractères.",
    "string.max": "Le nom doit contenir au maximum 30 caractères.",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "L'email doit être une chaîne de caractères.",
    "string.empty": "L'email est requis.",
    "string.email": "L'email doit être une adresse email valide.",
  }),
  password: passwordComplexity,
  phone_number: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "string.empty": "Le numéro de téléphone est requis.",
      "string.pattern.base": "Le numéro de téléphone doit être composé de 10 chiffres. Exemple : 0612345678",
    }),
  street_number: Joi.string()
    .pattern(/^[0-9a-zA-ZÀ-ÿ\s,'-]{1,5}$/)
    .required()
    .messages({
      "string.empty": "Le numéro de rue est requis.",
      "string.pattern.base": "Le numéro de rue doit être un nombre entre 1 et 5 chiffres.",
    }),
  address: Joi.string()
    .pattern(/^[0-9a-zA-ZÀ-ÿ\s,'-]{3,}$/)
    .required()
    .messages({
      "string.empty": "L'adresse est requise.",
      "string.pattern.base": "L'adresse n'est pas complète.",
    }),
    zip_code: Joi.string()
    .pattern(/^\d{5}$/)
    .required()
    .messages({
      "string.empty": "Le code postal est requis.",
      "string.pattern.base": "Le code postal doit être composé de 5 chiffres. Exemple : 75001",
    }),
    city: Joi.string()
    .pattern(/^[a-zA-ZÀ-ÿ\s-]{2,}$/)
    .required()
    .messages({
      "string.empty": "La ville est requise.",
      "string.pattern.base": "La ville doit contenir au moins 2 caractères et ne peut pas contenir de chiffres ou de caractères spéciaux.",
    }),
  rna_number: Joi.when("role_id", {
    is: 2, // Si role_id vaut 2 (association)
    then: Joi.string()
      .pattern(/^W\d{9}$/)
      .required()
      .messages({
        "any.required": "Le numéro RNA est requis pour les associations.",
        "string.pattern.base": "Le numéro RNA doit commencer par 'W' suivi de 9 chiffres.",
        "string.base": "Le numéro RNA doit être une chaîne de caractères.",
        "string.empty": "Le numéro RNA est requis.",
      }),
  }),
  role_id: Joi.number().integer().required(), // Entier, obligatoire (lien avec table Role en base)
});

export const userUpdateSchema = Joi.object({
  first_name: Joi.string().min(3).max(30).messages({
    "string.base": "Le prénom doit être une chaîne de caractères.",
    "string.min": "Le prénom doit contenir au moins 3 caractères.",
    "string.max": "Le prénom doit contenir au maximum 30 caractères.",
  }),
  last_name: Joi.string().min(3).max(30).messages({
    "string.base": "Le nom doit être une chaîne de caractères.",
    "string.min": "Le nom doit contenir au moins 3 caractères.",
    "string.max": "Le nom doit contenir au maximum 30 caractères.",
  }),
  email: Joi.string().email().messages({
    "string.base": "L'email doit être une chaîne de caractères.",
    "string.email": "L'email doit être une adresse email valide.",
  }),
  password: updatedPasswordComplexity,
  phone_number: Joi.string()
    .pattern(/^\d{10}$/)
    .messages({
      "string.pattern.base": "Le numéro de téléphone doit être composé de 10 chiffres.",
    }),
  street_number: Joi.string()
    .pattern(/^[0-9a-zA-ZÀ-ÿ\s,'-]{1,5}$/) // Accepte les numéros avec des lettres (ex: 1 bis)
    .messages({
      "string.pattern.base": "Le numéro de rue doit être un nombre entre 1 et 5 chiffres",
    }),
  address: Joi.string()
    .pattern(/^[0-9a-zA-ZÀ-ÿ\s,'-]{3,}$/)
    .messages({
      "string.pattern.base": "L'adresse contient des caractères non autorisés",
    }),
  zip_code: Joi.string()
    .pattern(/^\d{5}$/)
    .messages({
      "string.pattern.base": "Le code postal doit être composé de 5 chiffres. Exemple : 75001",
    }),
  city: Joi.string()
    .pattern(/^[a-zA-ZÀ-ÿ\s-]{2,}$/)
    .messages({
      "string.pattern.base": "La ville doit contenir au moins 2 caractères et ne peut pas contenir de chiffres ou de caractères spéciaux.",
    }),
  rna_number: Joi.string()
    .pattern(/^W\d{9}$/)
    .messages({
      "string.pattern.base": "Le numéro RNA doit commencer par 'W' suivi de 9 chiffres",
      "string.base": "Le numéro RNA doit être une chaîne de caractères",
    }),
  role_id: Joi.number().integer().optional(), // Entier, obligatoire (lien avec table Role en base)
});