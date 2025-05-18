import { User, Role, Localisation } from "../models/index.js";
import Joi from "joi";
import { hash, compare } from "../utils/crypto.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import { userRegisterSchema, userUpdateSchema } from "../validations/userShemas.js";

export async function getRoles(req, res, next) {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    console.error("Erreur lors de la récupération des rôles :", error);
    return next(error);
  }
}

export async function getLocalisations(req, res, next) {
  try {
    const localisations = await Localisation.findAll();
    res.status(200).json(localisations);
  } catch (error) {
    console.error("Erreur lors de la récupération des localisations :", error);
    return next(error);
  }
}

export async function getAllUsers(req, res) {
  const users = await User.findAll({
    include: ["role", "localisation"],
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

  const { firstname, lastname, email, password, address, phone_number, rma_number, role_id, localisation_id } =
    req.body;

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
    include: ["role", "localisation"],
  });
  if (!user) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  const validPassword = await compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }
  console.log("JWT_SECRET ===>", process.env.JWT_SECRET);

  const token = jwt.sign(
    { id: user.id }, 
    process.env.JWT_SECRET, 
    { expiresIn: "1d" } 
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

  const { firstname, lastname, email, password, address, phone_number, rma_number } = req.body;

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

async function checkDuplicates(email, phone_number, userId) {
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [
        { email },
        { phone_number },
      ],
    },
  });

  if (existingUser && existingUser.id !== userId) {
    if (existingUser.email === email) {
      const error = new Error("Cet email existe déjà veuillez en choisir un autre ");
      error.statusCode = 409;
      throw error;
    }
    if (existingUser.phone_number === phone_number) {
      const error = new Error("Ce numéro de téléphone existe déjà veuillez en choisir un autre");
      error.statusCode = 409;
      throw error;
    }
  }
  return null;
}