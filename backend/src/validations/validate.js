import { userRegisterSchema } from "./userShemas.js"; // schéma Joi défini dans userSchema.js pour valider les inscriptions
import { passwordComplexity } from "./password.js"; // règle pour vérifier la robustesse d’un mot de passe

export function validateUserInput(user) { // Prend en entrée un objet user (par ex. les données envoyées par un formulaire d’inscription)
  const { error } = userRegisterSchema.validate(user, { abortEarly: false }); // Utilise le schéma userRegisterSchema pour vérifier chaque champ (nom, email, mot de passe, téléphone, etc.)
  // Option { abortEarly: false } permet de ne pas arrêter la validation au premier échec, mais de récupérer toutes les erreurs en même temps

  // Si des erreurs sont trouvées, on les extrait et prépare un tableau de messages d’erreur
  if (error) {
    const messages = error.details.map((e) => e.message); // On crée un tableau de messages lisibles via error.details.map(...)
    return { valid: false, errors: messages } // On retourne un objet indiquant que la validation a échoué, avec les messages d’erreur
  }

  return { valid: true }; // Si tout est bon, on retourne un objet indiquant que la validation a réussi
}

export function validatePasswordComplexity(password) { // Fonction pour valider la complexité d’un mot de passe
  const { error } = passwordComplexity.validate(password);
  if (error) {
    return { valid: false, error: error.message}; // Si invalide, retourne { valid: false, error: "Le mot de passe doit contenir..." }.
  }
  return { valid: true }; // Si valide, retourne { valid: true }.
}

/*
validateUserInput(user) sert à vérifier toutes les données utilisateur à l’inscription

validatePasswordComplexity(password) sert uniquement à valider un mot de passe (utile si un utilisateur change juste son mot de passe)
*/