import Joi from "joi";
import { Animal, Localisation, Species, User_animal, User } from "../models/index.js";

export async function getAllAnimals(req, res, next) {
  try {
    const animals = await Animal.findAll({
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
        }
      ],
      attributes: { exclude: ['species_id', 'localisation_id', 'user_id'] }
    });
    console.log(`Récupération des animaux effectuée : ${animals}`);
    return res.json(animals);
  } catch (error) {
    error.statusCode = 500;
    error.message = "Erreur lors de la récupération des animaux";
    next(error);
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
  const animalSchema = Joi.object({
    name: Joi.string().required(),
    birthday: Joi.date().iso().required(),
    description: Joi.string().required(),
    picture: Joi.string().uri().required(),
    species_id: Joi.number().integer().required(),
    localisation_id: Joi.number().integer().required(),
    user_id: Joi.number().integer().required()
  });

  const { error, value } = animalSchema.validate(req.body);

  if (error) {
    const err = new Error(error.details.map(d => d.message));
    err.statusCode = 400;
    return next(err);
  }

  const { name, birthday, description, picture, species_id, localisation_id, user_id } = value;

  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      const error = new Error("Utilisateur non trouvé");
      error.statusCode = 404;
      return next(error);
    }

    const newAnimal = await Animal.create({
      name,
      birthday,
      description,
      picture,
      species_id,
      localisation_id,
      user_id
    });

    res.status(201).json(newAnimal);
  } catch (error) {
    error.statusCode = 500;
    error.message = "Erreur lors de la création de l'animal";
    next(error);
  }
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
    const messages = await User_animal.findAll({
    });
    res.json(messages);
  } catch(error) {
    error.statusCode = 500;
    error.message = "Erreur lors de la récupération des messages";
    next(error);
  }
};

export async function getOneMessage(req, res, next) {
  const { animalId, userId } = req.params;

  try {
    const message = await User_animal.findOne({
      where: {
        animal_id: parseInt(animalId, 10),
        user_id: parseInt(userId, 10)
      }
    });

    if (!message) {
      const error = new Error("Aucun message trouvé pour cet utilisateur et cet animal");
      error.statusCode = 404;
      return next(error);
    }

    return res.status(200).json({ 
      data: message
    });
  } catch (error) {
    error.statusCode = 500;
    error.message = "Erreur serveur";
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
      message
    });
    
    return res.status(201).json({ 
      message: "Message créé avec succès", 
      data: newMessage 
    });    
  } catch (error) {
    error.statusCode = 500;
    error.message = "Erreur serveur";
    next(error);
  }
}

function validateAnimalId(id) {
  const animalId = Number(id);
  if (!Number.isInteger(animalId)) {
    return null;
  }
  return animalId;
}