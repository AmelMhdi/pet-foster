import Joi from "joi";

export const passwordComplexity = Joi.string()
  .pattern(/^.{12,}$/, "longueur")
  .message("Le mot de passe doit contenir au moins 12 caractères")
  .pattern(/[A-Z]/, "majuscule")
  .message("Le mot de passe doit contenir au moins une lettre majuscule")
  .pattern(/[a-z]/, "minuscule")
  .message("Le mot de passe doit contenir au moins une lettre minuscule")
  .pattern(/[0-9]/, "chiffre")
  .message("Le mot de passe doit contenir au moins un chiffre")
  .pattern(/[\W_]/, "symbole")
  .message("Le mot de passe doit contenir au moins un symbole")
  .pattern(/^\S*$/, "pas d'espace")
  .message("Le mot de passe ne doit pas contenir d'espace")
  .required();

export const updatedPasswordComplexity = passwordComplexity.optional();