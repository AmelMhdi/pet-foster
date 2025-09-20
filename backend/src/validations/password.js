import Joi from "joi"; // Joi : une librairie qui permet de valider les données (comme les formulaires ou entrées utilisateur)
// Ici, Joi sert à définir une règle stricte pour les mots de passe

// C’est une règle exportée (utilisable ailleurs dans ton code)
export const passwordComplexity = Joi.string()
  .required() // Joi.string().required() -> la valeur doit être une chaîne obligatoire
  .custom((value, helpers) => { // .custom(...) -> on ajoute une validation personnalisée
    const errors = []; // on initialise un tableau errors = [] qui sert à lister les erreurs

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
  }, "Validation de la complexité du mot de passe"); // "Validation de la complexité du mot de passe" -> nom interne pour déboguer

export const updatedPasswordComplexity = passwordComplexity.optional(); // version optionnelle pour les mises à jour de profil