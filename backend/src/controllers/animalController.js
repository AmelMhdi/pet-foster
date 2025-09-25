import Joi from "joi";
import { Animal, Species, User } from "../models/index.js";
import { Sequelize } from "sequelize";

// Animals CRUD
export async function getAllAnimals(req, res) {
  const { limit, offset, random } = req.query;

  const queryOptions = {
    include: [
      "species", 
      { model: User, as: "association", attributes: ["id", "first_name", "last_name"] }
    ],
    order: [["id", "ASC"]],
  };

  if (limit) queryOptions.limit = parseInt(limit, 10);
  if (offset) queryOptions.offset = parseInt(offset, 10);
  if (random === "true") queryOptions.order = [Sequelize.literal("RANDOM()")];

  try {
    const animals = await Animal.findAll(queryOptions);
    return res.json(animals);
  } catch (error) {
    console.error("Erreur lors de la récupération des animaux :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des animaux." });
  }
}

export async function getOneAnimal(req, res, next) {
  const animalId = validateAnimalId(req.params.id);
  if (!animalId) return res.status(404).json({ error: "ID invalide." });

  try {
    const animal = await Animal.findByPk(animalId, { include: ["species"] });
    if (!animal) return res.status(404).json({ error: "Animal introuvable." });
    res.json(animal);
  } catch (error) {
    error.statusCode = 500;
    error.message = "Erreur serveur.";
    next(error);
  }
}

export async function createAnimal(req, res, next) {
  const user_id = req.user?.id;
  if (!user_id) return res.status(401).json({ error: "Utilisateur non authentifié." });

  const animalSchema = Joi.object({
    name: Joi.string().min(3).max(30).trim().required(),
    date_of_birth: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    description: Joi.string().min(10).trim().required(),
    picture: Joi.string().uri().required(),
    species_id: Joi.number().integer().required(),
  });

  const { error, value } = animalSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, date_of_birth, description, species_id } = value;

  try {
    const newAnimal = await Animal.create({
      name,
      date_of_birth: new Date(date_of_birth),
      description,
      picture,
      species_id,
      user_id: user_id,
    });
    res.status(201).json(newAnimal);
  } catch (error) {
    error.statusCode = 500;
    error.message = "Erreur lors de la création de l'animal.";
    next(error);
  }
}

export async function updateAnimal(req, res, next) {
  const animalId = validateAnimalId(req.params.id);
  if (!animalId) return res.status(404).json({ error: "ID invalide." });

  const { name, date_of_birth, description, picture, species_id } = req.body;
  if (!name || !date_of_birth || !description || !picture || !species_id) return res.status(400).json({ error: "Tous les champs sont requis." });

  try {
    const animal = await Animal.findByPk(animalId);
    if (!animal) return res.status(404).json({ error: "Animal introuvable." });

    if (req.user.id !== animal.user_id) return res.status(403).json({ message: "Action non autorisée." });

    const parsedDate = new Date(date_of_birth);
    if (isNaN(parsedDate.getTime()))
      return res.status(400).json({ error: "Le format de la date de naissance est invalide. Utilisez AAAA-MM-JJ." });

    animal.name = name;
    animal.date_of_birth = parsedDate;
    animal.description = description;
    animal.species_id = species_id;

    await animal.save();
    res.status(200).json({ message: "Animal mis à jour avec succès :", animal });
  } catch (error) {
    error.statusCode = 500;
    error.message = "Erreur interne du serveur.";
    next(error);
  }
}

export async function deleteAnimal(req, res, next) {
  const user_id = req.user?.id;
  if (!user_id) return res.status(401).json({ error: "Utilisateur non authentifié." });

  const animalId = validateAnimalId(req.params.id);
  if (!animalId) return next(new Error("ID invalide."));

  try {
    const animal = await Animal.findByPk(animalId);
    if (!animal) return next(Object.assign(new Error("L'animal n'existe pas."), { statusCode: 404 }));

    if (animal.user_id !== user_id) {
      return res.status(403).json({ message: "Action non autorisée." });
    }

    await animal.destroy();
    res.status(204).end();
  } catch (error) {
    error.statusCode = 500;
    error.message = "Erreur lors de la suppression de l'animal.";
    next(error);
  }
}

// Species
export async function getSpecies(req, res) {
  try {
    const species = await Species.findAll();
    res.json(species);
  } catch (error) {
    console.error("Erreur lors de la récupération des espèces :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des espèces." });
  }
}

// Helper to validate animal ID
function validateAnimalId(id) {
  const animalId = Number(id);
  return Number.isInteger(animalId) ? animalId : null;
}