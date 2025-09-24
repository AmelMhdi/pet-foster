import { User, Role } from "../models/index.js";
import Joi from "joi";
import { hash, compare } from "../utils/crypto.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import { userRegisterSchema, userUpdateSchema } from "../validations/userSchemas.js";

const BASE_URL = process.env.BASE_URL;
if (!BASE_URL) {
  throw new Error("BASE_URL is not defined");
}

export async function getRoles(req, res, next) {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    console.error("Erreur lors de la récupération des rôles :", error);
    return next(error);
  }
}

export async function getAllUsers(req, res) {
  const users = await User.findAll({
    include: ["role"],
    order: [["id", "ASC"]],
  });
  res.json(users);
}

export async function deleteUser(req, res, next) {
  const user_id = req.user?.id;
  if (!user_id) {
    return res.status(401).json({ error: "Utilisateur non authentifié" });
  }
  const userId = parseInt(req.params.id);

  if (!Number.isInteger(userId)) {
    return next();
  }
  
  const user = await User.findByPk(userId);
  if (!user) {
    return next();
  }

  await user.destroy();
  console.log(`User ${userId} supprimé`);
  res.status(204).end();
}

export async function register(req, res, next) {
  const error = validate(req);
  if (error) {
    return next(error);
  }

  function validate(req) {
    const { error } = userRegisterSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return {
        statusCode: 400,
        message: error.details.map((detail) => detail.message),
      };
    }
    return null;
  }

  const { first_name, last_name, email, password, address, phone_number, rna_number, role_id } =
    req.body;

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

  res.status(201).json(user);
}

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

  const { email, password } = req.body;
  const user = await User.findOne({
    where: { email },
    include: ["role"],
  });
  if (!user) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  const validPassword = await compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }
  console.log("JWT_SECRET =>", process.env.JWT_SECRET);

  
  const token = jwt.sign(
    { id: user.id }, 
    process.env.JWT_SECRET, 
    { expiresIn: "1d" } 
  );

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
}

export async function updateUser(req, res, next) {
  const user_id = req.user?.id;
  if (!user_id) {
    return res.status(401).json({ error: "Utilisateur non authentifié" });
  }

  const error = validateUpdatedFields(req);
  if (error) {
    return next(error);
  }

  function validateUpdatedFields(req) {
    const { error } = userUpdateSchema.validate(req.body, {
      abortEarly: false,
    });
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
    return next();
  }

  const { first_name, last_name, email, password, street_number, address, city, zip_code, phone_number, rna_number } = req.body;

  await checkDuplicates(email, phone_number, userId);
  const user = await User.findByPk(userId, {
    include: ["role"],
  });

  if (!user) {
    return next();
  }

  if (first_name) user.first_name = first_name;
  if (last_name) user.last_name = last_name;
  if (password) user.password = await hash(password);
  if (email) user.email = email;
  if (street_number) user.street_number = street_number;
  if (city) user.city = city;
  if (zip_code) user.zip_code = zip_code;
  if (address) user.address = address;
  if (phone_number) user.phone_number = phone_number;
  if (rna_number) user.rna_number = rna_number;

  await user.save();
  res.status(200).json(user);
}

async function checkDuplicates(email, phone_number, rna_number, userId) {
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [
        { email },
        { phone_number },
        { rna_number },
      ],
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