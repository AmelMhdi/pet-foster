import Joi from "joi";
import {
  Animal,
  Localisation,
  Species,
  User_animal,
  User,
} from "../models/index.js";
import { Sequelize } from "sequelize";

export async function getAllAnimals(req, res) {
  const { limit, random } = req.query;
  const queryOptions = {
    include: [
      {
        model: Species,
        as: "species",
        attributes: ["id", "name"],
      },
      {
        model: Localisation,
        as: "localisation",
        attributes: ["id", "city", "postcode"],
      },
    ],
    attributes: { exclude: ["species_id", "localisation_id", "user_id"] },
  };
  if (limit) {
    queryOptions.limit = parseInt(limit, 10);
  }

  if (random && random === "true") {
    queryOptions.order = [Sequelize.literal("RANDOM()")];
  }
  try {
    const animals = await Animal.findAll(queryOptions);
    console.log(`Récupération d'animaux : ${animals.length}`);
    return res.json(animals);
  } catch (error) {
    console.error("Erreur lors de la récupération des animaux:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des animaux" });
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
        "string.pattern.base":
          "La date doit être au format AAAA-MM-JJ, par ex : 2025-05-01",
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

  const { name, birthday, description, picture, species_id, localisation_id } =
    value;

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

  const { name, birthday: birthdayInput, description, picture } = req.body;

  if (!name || !birthdayInput || !description || !picture) {
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

    await animal.save();
    res.status(200).json({ message: "Animal mis à jour avec succès", animal });
  } catch (error) {
    error.statusCode = 500;
    error.message = "Erreur interne du serveur";
    next(error);
  }
}

export async function getMessages(req, res, next) {
  try {
    const messages = await User_animal.findAll({});
    res.json(messages);
  } catch (error) {
    error.statusCode = 500;
    error.message = "Erreur lors de la récupération des messages";
    next(error);
  }
}

export async function createOneMessage(req, res, next) {
  const { animalId, userId } = req.params;
  const { message } = req.body;

  try {
    if (!message || message.trim().length === 0) {
      const error = new Error("Le message ne peut pas être vide");
      error.statusCode = 400;
      return next(error);
    }

    const newMessage = await User_animal.upsert({
      animal_id: parseInt(animalId, 10),
      user_id: parseInt(userId, 10),
      message,
    });

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

/**
 * Fonction qui permet de récuperer un message de user en fonction de l'animal
 */
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

/**
 * Fonction qui permet de récuperer les espèces d'un animal
 */
export async function getSpecies(req, res) {
  try {
    const messages = await Species.findAll({});
    res.json(messages);
  } catch (error) {
    console.error("Erreur lors de la récupération des animaux:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des animaux" });
  }
}

function validateAnimalId(id) {
  const animalId = Number(id);
  if (!Number.isInteger(animalId)) {
    return null;
  }
  return animalId;
}
