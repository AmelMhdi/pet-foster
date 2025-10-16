import { User, Role, Animal } from "../models/index.js";
import Joi from "joi";
import { hash, compare } from "../utils/crypto.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import { userRegisterSchema, userUpdateSchema } from "../validations/userSchemas.js";

const BASE_URL = process.env.BASE_URL;
if (!BASE_URL) {
  throw new Error("BASE_URL is not defined");
}

// Roles & Users
export async function getRoles(req, res, next) {
  try {
    const roles = await Role.findAll({ attributes: ["id", "name"] });
    console.log("✅ Rôles trouvés :", roles);
    res.status(200).json(roles);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des rôles :", error);
    return next(error);
  }
}

export async function getAllUsers(req, res, next) {
  // récupérer le paramètre de requête "role"
  const { role } = req.query;

  // créer les options de filtre
  const whereClause = {};

  if (role && role.toLowerCase() === "admin") {
    whereClause.role_id = 1;
  } else if (role && role.toLowerCase() === "association") {
    whereClause.role_id = 2;
  } else if (role && role.toLowerCase() === "familleaccueil") {
    whereClause.role_id = 3;
  }

  // récupérer les utilisateurs avec le filtre
  const users = await User.findAll({
    where: whereClause,
    include: ["role"],
    order: [["id", "ASC"]],
  });
  res.json(users);
}

export async function getOneUser(req, res, next) {
  const userId = parseInt(req.params.id);
  if (!Number.isInteger(userId)) {
    return res.status(400).json({ error: "ID utilisateur invalide." });
  }

  try {
    const user = await User.findByPk(userId, {
      attributes: ["id", "first_name", "last_name", "role_id", "street_number", "address", "zip_code", "city", "phone_number"],
      include: [
        { model: Role, as: "role" }, { model: Animal, as: "animals" }
      ],
      exclude: ["password", "email", "rna_number"],
    });

    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé." });

    res.status(200).json(user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return next(error);
  }
}

export async function getAllAssociations(req, res, next) {
  try {
    const associations = await User.findAll({
      include: [
        {
          association: "role",
          where: { id: 1 }, // 1 = role association
        },
        { association: "localisation" },
      ],
      attributes: {
        exclude: ["password", "email", "phone_number", "rna_number", "street_number", "address", "city", "zip_code"],
      },
      order: [["id", "ASC"]],
    });
    res.status(200).json(associations);
  } catch (error) {
    console.error("Erreur lors de la récupération des associations :", error);
    return next(error);
  }
}

export async function getOneAssociation(req, res, next) {
  const associationId = parseInt(req.params.id);
  if (!Number.isInteger(associationId)) {
    return res.status(400).json({ error: "ID invalide." });
  }

  try {
    const association = await User.findOne({
      attributes: ["id", "first_name", "last_name", "email", "phone_number"],
      include: [
        {
          association: "animals_association",
          attributes: ["id", "name", "picture"],
          include: [
            {
              association: "species",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    if (!association) {
      return res.status(404).json({ error: "Association non trouvée." });
    }

    res.status(200).json(association);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'association :", error);
    return next(error);
  }
}

// Authentification (register, login)
export async function register(req, res, next) {
  console.log("=== DÉBUT REGISTER ===");
  console.log("req.body reçu:", req.body);
  console.log("role_id avant validation:", req.body.role_id);

  const error = validate(req);
  if (error) return next(error);

  function validate(req) {
    const { error } = userRegisterSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return {
        statusCode: 400,
        message: error.details.map((detail) => detail.message),
      };
    }
    return null;
  }

  const { 
    first_name, 
    last_name, 
    email, 
    password, 
    street_number, 
    address, 
    zip_code, 
    city, 
    phone_number, 
    rna_number, 
    role_id 
  } = req.body;

  console.log("role_id après destructuration:", role_id);
  console.log("Données avant création User:", {
    first_name,
    last_name,
    email,
    street_number,
    address,
    zip_code,
    city,
    phone_number,
    rna_number,
    role_id
  });

  await checkDuplicates(email, phone_number, rna_number);

  const user = await User.create({
    first_name,
    last_name,
    password: await hash(password),
    email,
    phone_number,
    street_number,
    address,
    city,
    zip_code,
    rna_number,
    role_id,
  });

  console.log("User créé:", user);
  console.log("=== FIN REGISTER ===");

  res.status(201).json(user);
}

export async function login(req, res) {
  console.log("=== Route /login appelée ===");
  console.log("Corps reçu :", req.body);

  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "L'email doit être renseigné.",
      "string.email": "Le format de l'email est invalide.",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Le mot de passe doit être renseigné.",
    }),
  });
  
  const { error } = schema.validate(req.body);
  console.log("Résultat validation Joi :", error?.details?.[0]?.message || "OK");

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email, password } = req.body;
  const user = await User.findOne({
    where: { email },
    include: ["role"],
  });

  console.log("Utilisateur trouvé :", user ? user.email : "Aucun utilisateur trouvé");

  if (!user) {
    return res.status(401).json({ error: "Identifiants invalides." });
  }

  console.log("Mot de passe reçu:", password);
  console.log("Hash en base:", user.password);

  try {
    const validPassword = await compare(password, user.password);
    console.log("Résultat comparaison mot de passe:", validPassword);

    if (!validPassword) {
      return res.status(401).json({ error: "Identifiants invalides." });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.json({
      token,
      expiresIn: "1d",
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      address: user.address,
      phone_number: user.phone_number,
      street_number: user.street_number,
      city: user.city,
      zip_code: user.zip_code,
      role: {
        id: user.role.id,
        name: user.role.name,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la comparaison de mot de passe :", error);
    return res.status(500).json({ error: "Erreur serveur." });
  }
}

// Update & Delete User
export async function updateUser(req, res, next) {
  const currentUserId = req.user?.id;
  if (!currentUserId) {
    return res.status(401).json({ error: "Utilisateur non authentifié." });
  }

  const error = validateUpdatedFields(req);
  if (error) return next(error);

  function validateUpdatedFields(req) {
    const { error } = userUpdateSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return {
        statusCode: 400,
        message: error.details.map((detail) => detail.message),
      };
    }
    return null;
  }

  const userId = parseInt(req.params.id);

  if (!Number.isInteger(userId)) {
    return res.status(400).json({ error: "ID utilisateur invalide." });
  }

  // Only allow users to update their own profile unless they are admin
  if (req.user.id !== userId && req.user.role?.name !== "admin") {
    return res.status(403).json({ error: "Action non autorisée." });
  }

  const { 
    first_name, 
    last_name, 
    email, 
    password, 
    street_number, 
    address, 
    zip_code, 
    city, 
    phone_number, 
    rna_number 
  } = req.body;

  await checkDuplicates(email, phone_number, rna_number, userId);

  const user = await User.findByPk(userId, { include: ["role"] });
  if (!user) {
    return res.status(404).json({ error: "Utilisateur non trouvé." });
  }

  if (first_name) user.first_name = first_name;
  if (last_name) user.last_name = last_name;
  if (password) user.password = await hash(password);
  if (email) user.email = email;
  if (street_number) user.street_number = street_number;
  if (zip_code) user.zip_code = zip_code;
  if (city) user.city = city;
  if (address) user.address = address;
  if (phone_number) user.phone_number = phone_number;
  if (rna_number) user.rna_number = rna_number;

  await user.save();
  res.status(200).json(user);
}

export async function deleteUser(req, res, next) {
  const currentUserId = req.user?.id;
  if (!currentUserId) {
    return res.status(401).json({ error: "Utilisateur non authentifié." });
  }
  const userId = parseInt(req.params.id);
  if (!Number.isInteger(userId)) {
    return res.status(400).json({ error: "ID utilisateur invalide." });
  }
  
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ error: "Utilisateur non trouvé." });
  }

  // Only allow users to delete their own profile unless they are admin
  if (req.user.id !== userId && req.user.role?.name !== "admin") {
    return res.status(403).json({ error: "Action non autorisée." });
  }

  await user.destroy();
  console.log(`User ${userId} supprimé`);
  res.status(204).end();
}

// Helper functions
async function checkDuplicates(email, phone_number, rna_number, userId) {
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ email }, { phone_number }, { rna_number }],
    },
  });

  if (existingUser && existingUser.id !== userId) {
    if (existingUser.email === email) throw createConflictError("email");
    if (existingUser.phone_number === phone_number) throw createConflictError("numéro de téléphone");
    if (rna_number && existingUser.rna_number === rna_number) throw createConflictError("numéro RNA");
  }
  return null;
}

function createConflictError(field) {
  const error = new Error(`Ce ${field} existe déjà, veuillez en choisir un autre.`);
  error.statusCode = 409;
  return error;
}