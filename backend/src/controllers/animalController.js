import Joi from "joi";
import {Animal, Species, User_animal } from "../models/index.js";
import { Sequelize } from "sequelize";

export async function getAllAnimals(req, res) {
  const { limit, offset, random } = req.query;
  const queryOptions = {
    attributes: { exclude: ["species_id", "localisation_id", "user_id", "birthday", "description"] },
  };
  if (limit) {
    queryOptions.limit = parseInt(limit, 10);
  }

  if (offset) {
    queryOptions.offset = parseInt(offset, 10);
  }

  if (random && random === "true") {
    queryOptions.order = [Sequelize.literal("RANDOM()")];
  }
  try {
    const animals = await Animal.findAll(queryOptions);
    return res.json(animals);
  } catch (error) {
    console.error("Erreur lors de la récupération des animaux:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des animaux" });
  }
}

export async function getOneAnimal(req, res, next) {
  const animalId = validateAnimalId(req.params.id);
  if (!Number.isInteger(animalId)) {
    return res.status(400).json({ error: "ID invalide" });
  }
  try {
    const animal = await Animal.findByPk(animalId, {
      include: ["species", "localisation"],
    });
    if (!animal) {
      return res.status(404).json({ error: "Animal introuvable." });
    }
    res.json(animal);
  } catch (error) {
    error.statusCode = 500;
    error.message = "Erreur serveur";
    next(error);
  }
}

export async function deleteAnimal(req, res, next) {
  const user_id = req.user?.id;
  if (!user_id) {
    return res.status(401).json({ error: "Utilisateur non authentifié" });
  }
  const animalId = validateAnimalId(req.params.id);
  if (!Number.isInteger(animalId)) {
    const error = new Error("ID invalide");
    error.statusCode = 400;
    return next(error);
  }
  try {
    const animal = await Animal.findByPk(animalId);
    if (!animal) {
      const error = new Error("L'animal n'existe pas");
      error.statusCode = 404;
      return next(error);
    }
    await animal.destroy();
    res.status(204).end();
  } catch (error) {
    error.statusCode = 500;
    error.message = "Erreur lors de la suppression de l'animal";
    next(error);
  }
}

export async function createAnimal(req, res, next) {
  const user_id = req.user?.id;
  if (!user_id) {
    return res.status(401).json({ error: "Utilisateur non authentifié" });
  }

  const animalSchema = Joi.object({
    name: Joi.string().min(3).max(30).trim().required().messages({
      "string.base": "Le nom doit être une chaîne de caractères",
      "string.min": "Le nom doit contenir au moins 3 caractères",
      "string.max": "Le nom doit contenir au maximum 30 caractères",
    }),
    birthday: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required()
      .messages({
        "string.pattern.base": "La date doit être au format AAAA-MM-JJ, par ex : 2025-05-01",
        "any.required": "La date est obligatoire",
      }),
    description: Joi.string().min(10).trim().required().messages({
      "string.base": "La description doit être un texte.",
      "string.empty": "La description est obligatoire.",
      "string.min": "La description doit contenir au moins 10 caractères.",
      "any.required": "La description est obligatoire.",
    }),
    picture: Joi.string().uri().required(),
    species_id: Joi.number().integer().required(),
    localisation_id: Joi.number().integer().required(),
  });

  const { error, value } = animalSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { name, birthday, description, picture, species_id, localisation_id } = value;

  const newAnimal = await Animal.create({
    name,
    birthday,
    description,
    picture,
    species_id,
    localisation_id,
    user_id,
  });

  res.status(201).json(newAnimal);
}

export async function updateAnimal(req, res, next) {
  const animalId = validateAnimalId(req.params.id);
  if (!Number.isInteger(animalId)) {
    const error = new Error("ID invalide");
    error.statusCode = 400;
    return next(error);
  }

  const { name, birthday: birthdayInput, description, picture, localisation_id, species_id, user_id } = req.body;

  if (!name || !birthdayInput || !description || !picture || !localisation_id || !species_id || !user_id) {
    const error = new Error("Tous les champs sont requis");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const animal = await Animal.findByPk(animalId);
    if (!animal) {
      const error = new Error("L'animal n'existe pas");
      error.statusCode = 404;
      return next(error);
    }

    if (req.user?.id !== animal.user_id) {
      return res.status(403).json({ message: "Action non autorisée" });
    }

    const birthday = new Date(birthdayInput);
    if (isNaN(birthday.getTime())) {
      const error = new Error("La date de naissance est invalide.");
      error.statusCode = 400;
      return next(error);
    }

    animal.name = name;
    animal.birthday = birthday;
    animal.description = description;
    animal.picture = picture;
    animal.localisation_id = localisation_id;
    animal.species_id = species_id;
    animal.user_id = user_id;

    await animal.save();

    res.status(200).json({ message: "Animal mis à jour avec succès", animal });
  } catch (error) {
    error.statusCode = 500;
    error.message = "Erreur interne du serveur";
    next(error);
  }
}

export async function createOneMessage(req, res, next) {
  const animalId = parseInt(req.params.animalId, 10);
  const userId = parseInt(req.params.userId, 10);
  const { message } = req.body;

  if (!Number.isInteger(animalId) || !Number.isInteger(userId)) {
    const error = new Error("ID invalide");
    error.statusCode = 400;
    return next(error);
  }

  if (!message || message.trim().length === 0) {
    const error = new Error("Le message ne peut pas être vide");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const [newMessage, created] = await User_animal.upsert({
      animal_id: animalId,
      user_id: userId,
      message,
    });

    if (!newMessage) {
      const error = new Error("Erreur lors de la création du message");
      error.statusCode = 500;
      return next(error);
    }

    if (req.user?.id !== newMessage.user_id) {
      return res.status(403).json({ message: "Action non autorisée" });
    }

    return res.status(201).json({
      message: "Message créé avec succès",
      data: newMessage,
    });
  } catch (error) {
    error.statusCode = 500;
    error.message = "Erreur serveur";
    next(error);
  }
}

export async function getOneMessage(req, res, next) {
  const { animalId, userId } = req.params;
  const getMessage = await User_animal.findOne({
    where: {
      user_id: userId,
      animal_id: animalId,
    },
    include: ["user", "animal"],
  });

  if (!getMessage) {
    return next();
  }

  return res.status(200).json({
    message: getMessage.message,
    user: {
      firstname: getMessage.user.firstname,
      lastname: getMessage.user.lastname,
    },
    animal: {
      name: getMessage.animal.name,
    },
    created_at: getMessage.created_at,
  });
}

export async function getSpecies(req, res) {
  try {
    const messages = await Species.findAll({});
    res.json(messages);
  } catch (error) {
    console.error("Erreur lors de la récupération des animaux:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des animaux" });
  }
}

function validateAnimalId(id) {
  const animalId = Number(id);
  if (!Number.isInteger(animalId)) {
    return null;
  }
  return animalId;
}