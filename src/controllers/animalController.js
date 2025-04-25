import { Animal } from "../models/Animal.js";

export async function getAllAnimals(req, res) {
  const animals = await Animal.findAll();
  console.log(`Récupération des animaux suivants : ${animals}`);
  res.json(animals);
}

export async function getOneAnimal(req, res) {
  const animalId = parseInt(req.params.id);
  const animal = await Animal.findByPk(animalId);
  if (!animal) {
    return res.status(404).json({ error: "Animal not found."});
  }
  res.json(animal);
}

export async function deleteAnimal(req, res) {
  const animalId = parseInt(req.params.id);

  if (!Number.isInteger(animalId)) {
    return res.status(404).json({ error: "L'animal n'existe pas" });
  }

  const animal = await Animal.findByPk(animalId);

  if (!animal) {
    return res.status(404).json({ error: "L'animal n'existe pas" });
  }

  await animal.destroy();
  console.log(`Animal ${animalId} supprimé`);

  res.status(204).end();
}

// export async function createAnimal(req, res) {
//   /*
  
//   // valider le body avec joi avant de le récupérer ?

//   const animalSchema = Joi.object({
//     name: Joi.string().required(),
//     species: Joi.string().required(),
//     birthday: Joi.date().iso().required(),
//     description: Joi.string().required()
//   });

//   // Récupérer le body
//   const { error } = createAnimalSchema.validate(req.body);
//   if (error) {
//     return res.status(400).json({ error: error.message });
//   }
  
//   */

//   const { name, species, birthday, description } = req.body;

//   // On vérifie que l'animal existe
//   // Autrement dit, on vérifie la FOREIGN KEY !

//   if (!name || !species || !birthday || !description) {
//     return res.status(400).json({ error: "Tous les champs sont requis" });
//   }
//   try {
//     const newAnimal = await Animal.create({
//       name,
//       species,
//       birthday,
//       description
//     });

//     res.status(201).json(newAnimal);  
  
//   } catch (error) {
//     return res.status(400).json({ error: error.details[0].message });
//   }
// }

export async function createAnimal(req, res) {
  console.log("Requête createAnimal reçue", req.body);

  const { name, birthday, description, picture } = req.body;
  
  // On vérifie que les champs requis sont présents
  if (!name || !birthday || !description || !picture) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }
  
  try {
    const newAnimal = await Animal.create({
      name,
      birthday,
      description,
      picture
    });
    res.status(201).json(newAnimal);
  } catch (error) {
    console.error("Erreur lors de la création de l'animal:", error);
    
    // Gestion des erreurs Sequelize
    return res.status(500).json({ 
      error: "Erreur lors de la création de l'animal", 
      message: error.message 
    });
  }
}