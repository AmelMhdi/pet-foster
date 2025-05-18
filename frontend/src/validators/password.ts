import Joi from "joi";

export const passwordComplexity = Joi.string()
  .required()
  .custom((value, helpers) => {
    const errors = [];

    if (value.length < 12) {
      errors.push("au moins 12 caractères");
    }

    if (!/[A-Z]/.test(value)) {
      errors.push("au moins une majuscule");
    }

    if (!/[a-z]/.test(value)) {
      errors.push("au moins une minuscule");
    }

    if (!/[0-9]/.test(value)) {
      errors.push("au moins un chiffre");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors.push("au moins un caractère spécial");
    }

    if (/\s/.test(value)) {
      errors.push("aucun espace");
    }

    if (errors.length) {
      return helpers.error("any.invalid", { message: `Le mot de passe doit contenir ${errors.join(", ")}` });
    }

    return value;
  }, "Validation de la complexité du mot de passe");

export const updatedPasswordComplexity = passwordComplexity.optional();