import { User, Role, Localisation } from "../models/index.js";
import Joi from "joi";
import { hash, compare, generateJwtToken } from "../utils/crypto.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";

/**
 * Fonction qui récupère tous les roles *
 */
export async function getRoles(req, res, next) {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    console.error("Erreur lors de la récupération des rôles :", error);
    return next(error);
  }
}

/**
 * Fonction qui récupère toutes les localisations *
 */
export async function getLocalisations(req, res, next) {
  try {
    const localisations = await Localisation.findAll();
    res.status(200).json(localisations);
  } catch (error) {
    console.error("Erreur lors de la récupération des localisations :", error);
    return next(error);
  }
}

/**
 * Fonction qui récupère tous les utilisateurs
 */
export async function getAllUsers(req, res) {
  const users = await User.findAll({
    include: ["role", "localisation"],
    order: [["id", "ASC"]],
  });
  res.json(users);
}

/**
 * Fonction  qui supprime un utilisateur
 */

export async function deleteUser(req, res, next) {
  const userId = parseInt(req.params.id);

  // Vérifier que cet ID est un entier
  if (!Number.isInteger(userId)) {
    return next();
  }
  // Récupérer user à supprimer en BDD
  const user = await User.findByPk(userId);
  if (!user) {
    return next();
  }

  await user.destroy();
  console.log(`User ${userId} supprimé`);
  res.status(204).end();
}

/**
 * Fonction qui enregistre un nouvel utilisateur
 */
export async function register(req, res, next) {
  const error = validate(req);
  if (error) {
    return next(error);
  }

  const {
    firstname,
    lastname,
    email,
    password,
    address,
    phone_number,
    rma_number,
    role_id,
    localisation_id,
  } = req.body;

  await checkDuplicates(email, phone_number, rma_number);

  const user = await User.create({
    firstname,
    lastname,
    password: await hash(password),
    email,
    address,
    phone_number,
    rma_number,
    role_id,
    localisation_id,
  });

  res.status(201).json(user);
}

/**
 * Fonction qui permet à l'utilisateur de se connecter
 */
export async function login(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "L'email doit être renseigné",
      "string.email": "Le format de l'email est invalide",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Le mot de passe doit être renseigné",
    }),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  if (error) {
    return next(error);
  }

  const { email, password } = req.body;
  const user = await User.findOne({
    where: { email },
    include: ["role", "localisation"],
  });
  if (!user) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  const validPassword = await compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  // const token = generateJwtToken({ userId: user.id });
  const token = jwt.sign(
    { id: user.id }, // données dans le token
    process.env.JWT_SECRET, // clé secrète (depuis .env)
    { expiresIn: "1d" } // durée de validité
  );

  return res.json({
    token,
    expiresIn: "1d",
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    address: user.address,
    phone_number: user.phone_number,
    localisation: user.localisation,
    role: {
      id: user.role.id,
      name: user.role.name,
    },
  });
}

/**
 * Fonction qui permet à l'utilisateur mettre à jour ses informations *
 */
export async function updateUser(req, res, next) {
  const error = validateUpdatedFields(req);
  if (error) {
    return next(error);
  }
  const userId = parseInt(req.params.id);

  if (!Number.isInteger(userId)) {
    return next();
  }

  const {
    firstname,
    lastname,
    email,
    password,
    address,
    phone_number,
    rma_number,
    role_id,
  } = req.body;

  await checkDuplicates(email, phone_number, userId);
  const user = await User.findByPk(userId, {
    include: ["role", "localisation"],
  });

  if (!user) {
    return next();
  }

  if (firstname) user.firstname = firstname;
  if (lastname) user.lastname = lastname;
  if (password) user.password = await hash(password);
  if (email) user.email = email;
  if (address) user.address = address;
  if (phone_number) user.phone_number = phone_number;
  if (rma_number) user.rma_number = rma_number;

  await user.save();
  res.status(200).json(user);
}

/**
 * Shema de validation Joi de l'enregistrement d'un compte
 */
function validate(req) {
  const schema = Joi.object({
    firstname: Joi.string().min(3).max(30).required().messages({
      "string.base": "Le prénom doit être une chaîne de caractères",
      "string.min": "Le prénom doit contenir au moins 3 caractères",
      "string.max": "Le prénom doit contenir au maximum 30 caractères",
    }),
    lastname: Joi.string().min(3).max(30).required().messages({
      "string.base": "Le nom doit être une chaîne de caractères",
      "string.min": "Le nom doit contenir au moins 3 caractères",
      "string.max": "Le nom doit contenir au maximum 30 caractères",
    }),
    password: passwordComplexity,
    email: Joi.string().email().required().messages({
      "string.base": "L'email doit être une chaîne de caractères",
      "string.email": "L'email doit être une adresse email valide",
    }),
    address: Joi.string()
      .pattern(/^[0-9a-zA-ZÀ-ÿ\s,'-]{3,}$/)
      .required()
      .messages({
        "string.pattern.base": "L'adresse n'est pas complète",
      }),
    phone_number: Joi.string()
      .pattern(/^\d{10}$/)
      .required()
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
        "any.required": "Le numéro RMA est requis",
      }),
    role_id: Joi.number().integer().required(),
    localisation_id: Joi.number().integer().required(),
  });

  const error = schema.validate(req.body, { abortEarly: false }).error;

  if (error) {
    return {
      statusCode: 400,
      message: error.details.map((detail) => detail.message),
    };
  }

  return null;
}

const passwordComplexity = Joi.string()
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

/**
 * Fonction qui permet de controler les doublons lors de l'enregistrement de l'utilisateur
 */
async function checkDuplicates(email, phone_number, userId) {
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [
        { email },
        { phone_number },
        // { rma_number }
      ],
    },
  });

  if (existingUser && existingUser.id !== userId) {
    if (existingUser.email === email) {
      const error = new Error(
        "Cet email existe déjà veuillez en choisir un autre "
      );
      error.statusCode = 409;
      throw error;
    }
    if (existingUser.phone_number === phone_number) {
      const error = new Error(
        "Ce numéro de téléphone existe déjà veuillez en choisir un autre"
      );
      error.statusCode = 409;
      throw error;
    }
    // if (existingUser.rma_number === rma_number) {
    //   throw { status: 409, message: "RNA number already taken" };
    // }
  }
  return null;
}

/**
 * Shema de validation Joi lors de la mise à jour du compte
 */
function validateUpdatedFields(req) {
  const schema = Joi.object({
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
    password: updatedPasswordComplexity,
    email: Joi.string().email().optional().messages({
      "string.base": "L'email doit être une chaîne de caractères",
      "string.email": "L'email doit être une adresse email valide",
    }),
    address: Joi.string()
      .pattern(/^[0-9a-zA-ZÀ-ÿ\s,'-]{3,}$/)
      .optional()
      .messages({
        "string.pattern.base":
          "L'adresse contient des caractères non autorisés",
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

  const error = schema.validate(req.body, { abortEarly: false }).error;

  return error
    ? {
        statusCode: 400,
        message: error.details.map((detail) => detail.message),
      }
    : null;
}

const updatedPasswordComplexity = Joi.string()
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
  .optional();
