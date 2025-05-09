import { User, Role, Localisation } from "../models/index.js";
import Joi from "joi";
import { hash, compare, generateJwtToken } from "../utils/crypto.js";
import { Op } from "sequelize";

/**
 * Fonction qui récupère tous les roles
 *
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
 * Fonction qui récupère toutes les localisations
 *
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
    // include: [
    //   { association: "role" },
    //   { association: "localisation" }
    // ],
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
  // Si une erreur de validation existe, on la transmet au middleware d'erreur
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

  // Vérification email,téléphone, RNA déjà utilisés
  try {
    // await checkDuplicates(email, phone_number, rma_number);
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
    console.log(
      `Création utilisateur : ${user.firstname} ${user.lastname} - ${user.email}`
    );
    console.log("role_id reçu :", req.body.role_id);

    res.status(201).json({ status: 201, user });
  } catch (error) {
    console.error("Erreur à l'insertion :", error);
    return next(error);
  }
}

/**
 * Fonction qui permet à l'utilisateur de se connecter
 
 */

export async function login(req, res) {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "L'email doit être renseigné",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Le mot de passe doit être renseigné",
    }),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(401)
      .json({ status: 400, message: error.details[0].message });
  }

  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email },
    include: ["role", "localisation"],
  });

  if (!user) {
    return res
      .status(401)
      .json({ status: 401, message: "Identifiants invalides" });
  }

  // Fonction de argon2 stockée dans crypto, pour comparer le mot de passe saisi et celui de la bdd
  const validPassword = await compare(password, user.password);

  console.log({ validPassword });
  if (!validPassword) {
    return res
      .status(401)
      .json({ status: 401, message: "Identifiants invalides" });
  }
  console.log("Utilisateur connecté, ID:", user.id);

  const token = generateJwtToken({ userId: user.id });
  res.json({
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
 * Fonction qui permet à l'utilisateur mettre à jour ses informations
 * // quand on verifie avec un PUT attention à l'id renseigné exemple Bruno=> id=2 http://localhost:3001/api/users/2
 */
export async function updateUser(req, res, next) {
  const error = validateUpdatedFields(req);
  // Si une erreur de validation existe, on la transmet au middleware d'erreur
  if (error) {
    return next(error);
  }
  // console.log("Données reçues:", req.body);

  const userId = parseInt(req.params.id);
  // console.log("Id récupéré:", userId);

  // Vérifier que cet ID est un entier
  if (!Number.isInteger(userId)) {
    return next();
  }

  // Extraction des données nécessaires depuis la requête
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

  // Vérification email,téléphone,RNA déjà utilisés
  await checkDuplicates(email, phone_number, userId);
  // Récupérer user en BDD
  const user = await User.findByPk(userId, {
    include: ["role", "localisation"],
  });

  if (!user) {
    return next();
  }

  //on met à jour s'il y a une modification sinon on n'y touche pas
  if (firstname) user.firstname = firstname;
  if (lastname) user.lastname = lastname;
  if (password) user.password = await hash(password);
  if (email) user.email = email;
  if (address) user.address = address;
  if (phone_number) user.phone_number = phone_number;
  if (rma_number) user.rma_number = rma_number;

  //enregistrement en bdd
  await user.save();

  // Affichage des valeurs de l'utilisateur, avec le nom du rôle
  // console.log(`
  // ID: ${user.id},
  // Prénom: ${user.firstname},
  // Nom: ${user.lastname},
  // Email: ${user.email},
  // Adresse: ${user.address},
  // Téléphone: ${user.phone_number},
  // Numéro RMA: ${user.rma_number},
  // Role: ${user.role.name}`);

  // Afficher un message indiquant si des champs ont été modifiés
  // console.log(`✅ Utilisateur modifié :
  // ID: ${user.id},
  // Prénom: ${firstname !== user.firstname ? `modifié de ${user.firstname} à ${firstname}` : user.firstname},
  // Nom: ${lastname !== user.lastname ? `modifié de ${user.lastname} à ${lastname}` : user.lastname},
  // Email: ${email !== user.email ? `modifié de ${user.email} à ${email}` : user.email},
  // Adresse: ${address !== user.address ? `modifié de ${user.address} à ${address}` : user.address},
  // Téléphone: ${phone_number !== user.phone_number ? `modifié de ${user.phone_number} à ${phone_number}` : user.phone_number},
  // Numéro RMA: ${rma_number !== user.rma_number ? `modifié de ${user.rma_number} à ${rma_number}` : user.rma_number},
  // Role ID: ${role_id !== user.role_id ? `modifié de ${user.role_id} à ${role_id}` : user.role_id}`);

  // On renvoie user modifié 200 = succès
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
    phone_number: Joi.string().required().messages({
      "string.pattern.base":
        "Le numéro de téléphone doit être une chaîne de caractères",
    }),
    rma_number: Joi.string()
      .pattern(/^W\d{9}$/)
      .required()
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

  return error
    ? {
        statusCode: 400,
        message: error.details.map((detail) => detail.message),
      }
    : null;
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
