import Joi from "joi"; // Joi : une librairie qui permet de valider les données (comme les formulaires ou entrées utilisateur)
// Ici, on définit des schémas de validation pour les utilisateurs (à l’inscription et à la mise à jour)
import { passwordComplexity, updatedPasswordComplexity } from "./password.js"; // passwordComplexity : un schéma de validation pour les mots de passe, importé depuis un autre fichier

// Ce schéma décrit ce qu’un nouvel utilisateur doit fournir pour s’inscrire
export const userRegisterSchema = Joi.object({
  firstname: Joi.string().min(3).max(30).required().messages({
    "string.base": "Le prénom doit être une chaîne de caractères",
    "string.empty": "Le prénom est requis",
    "string.min": "Le prénom doit contenir au moins 3 caractères",
    "string.max": "Le prénom doit contenir au maximum 30 caractères",
  }),
  lastname: Joi.string().min(3).max(30).required().messages({
    "string.base": "Le nom doit être une chaîne de caractères",
    "string.empty": "Le nom est requis",
    "string.min": "Le nom doit contenir au moins 3 caractères",
    "string.max": "Le nom doit contenir au maximum 30 caractères",
  }),
  password: passwordComplexity, // Validation via passwordComplexity importé
  email: Joi.string().email().required().messages({
    "string.base": "L'email doit être une chaîne de caractères",
    "string.empty": "L'email est requis",
    "string.email": "L'email doit être une adresse email valide",
  }),
  address: Joi.string()
    .pattern(/^[0-9a-zA-ZÀ-ÿ\s,'-]{3,}$/)
    .required()
    .messages({
      "string.empty": "L'adresse est requise",
      "string.pattern.base": "L'adresse n'est pas complète",
    }),
  phone_number: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "string.empty": "Le numéro de téléphone est requis",
      "string.pattern.base":
        "Le numéro de téléphone doit être composé de 10 chiffres",
    }),
  rma_number: Joi.string()
    .pattern(/^W\d{9}$/)
    .optional() // Champ optionnel pour associations
    .messages({
      "string.pattern.base":
        "Le numéro RMA doit commencer par 'W' suivi de 9 chiffres",
      "string.base": "Le numéro RMA doit être une chaîne de caractères",
      "any.required": "Le numéro RMA est requis",
    }),
  role_id: Joi.number().integer().required(), // Entier, obligatoire (lien avec table Role en base)
  localisation_id: Joi.number().integer().required(), // Entier, obligatoire (lien avec table Localisation en base)
});

// Même schéma, mais tous les champs deviennent optionnels
// Il est utilisé quand un utilisateur met à jour son profil et peut modifier un ou plusieurs champs
export const userUpdateSchema = Joi.object({
  firstname: Joi.string().min(3).max(30).optional().messages({
    "string.base": "Le prénom doit être une chaîne de caractères",
    "string.min": "Le prénom doit contenir au moins 3 caractères",
    "string.max": "Le prénom doit contenir au maximum 30 caractères",
  }),
  lastname: Joi.string().min(3).max(30).optional().messages({
    "string.base": "Le nom doit être une chaîne de caractères",
    "string.min": "Le nom doit contenir au moins 3 caractères",
    "string.max": "Le nom doit contenir au maximum 30 caractères",
  }),
  password: updatedPasswordComplexity, // Validation via updatedPasswordComplexity importé
  email: Joi.string().email().optional().messages({
    "string.base": "L'email doit être une chaîne de caractères",
    "string.email": "L'email doit être une adresse email valide",
  }),
  address: Joi.string()
    .pattern(/^[0-9a-zA-ZÀ-ÿ\s,'-]{3,}$/)
    .optional()
    .messages({
      "string.pattern.base": "L'adresse contient des caractères non autorisés",
    }),
  phone_number: Joi.string()
    .pattern(/^\d{10}$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Le numéro de téléphone doit être composé de 10 chiffres",
    }),
  rma_number: Joi.string()
    .pattern(/^W\d{9}$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Le numéro RMA doit commencer par 'W' suivi de 9 chiffres",
      "string.base": "Le numéro RMA doit être une chaîne de caractères",
    }),
  role_id: Joi.number().integer().optional(),
  localisation_id: Joi.number().integer().optional(),
});

/**
 * Exemple d’objet valide pour l’inscription (userRegisterSchema) :
{
  "firstname": "Marie",
  "lastname": "Dupont",
  "password": "SuperPass!123",
  "email": "marie.dupont@example.com",
  "address": "12 rue des Lilas",
  "phone_number": "0612345678",
  "role_id": 2,
  "localisation_id": 1
}
  
  * Exemple d’objet invalide :
{
  "firstname": "Al",
  "lastname": "D",
  "password": "12345",
  "email": "mauvaismail",
  "phone_number": "123",
  "role_id": "abc",
  "localisation_id": null
}
*/