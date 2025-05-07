import { Animal, Localisation, Species, User_animal,User } from "../models/index.js";

export async function getAllAnimals(req, res) {
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
    res.json(animals);
  } catch (error) {
    console.error("Erreur lors de la récupération des animaux:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des animaux" });
  }
}

export async function getOneAnimal(req, res) {
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
    console.error("Erreur lors de la récupération de l'animal:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function deleteAnimal(req, res) {
  const animalId = validateAnimalId(req.params.id);
  if (!Number.isInteger(animalId)) {
    return res.status(400).json({ error: "ID invalide" });
  }
  const animal = await Animal.findByPk(animalId);
  if (!animal) {
    return res.status(404).json({ error: "L'animal n'existe pas" });
  }
  await animal.destroy();
  console.log(`Animal ${animalId} supprimé`);
  res.status(204).end();
}

// version du createAnimal avec Joi
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

// export async function createAnimal(req, res) {
//   console.log("Requête createAnimal reçue", req.body);
//   const { name, birthday, description, picture } = req.body;
  
//   // On vérifie que les champs requis sont présents
//   if (!name || !birthday || !description || !picture) {
//     return res.status(400).json({ error: "Tous les champs sont requis" });
//   }
  
//   try {
//     const newAnimal = await Animal.create({
//       name,
//       birthday,
//       description,
//       picture
//     });
//     res.status(201).json(newAnimal);
//   } catch (error) {
//     console.error("Erreur lors de la création de l'animal:", error);
    
//     // Gestion des erreurs Sequelize
//     return res.status(500).json({ 
//       error: "Erreur lors de la création de l'animal", 
//       message: error.message 
//     });
//   }
// }

export async function updateAnimal(req, res) {
  const animalId = validateAnimalId(req.params.id);

  console.log("ID de l'animal : ", animalId);

  if (!Number.isInteger(animalId)) {
    return res.status(400).json({ error: "ID invalide" });
  }

  const { name, birthday: birthdayInput, description, picture } = req.body;

  console.log("Données reçues : ", req.body);

  if (!name || !birthdayInput || !description || !picture) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  // On vérifie que l'animal existe
  const animal = await Animal.findByPk(animalId);

  console.log("Animal trouvé:", animal);

  if (!animal) {
    return res.status(404).json({ error: "L'animal n'existe pas" });
  }

  // Validation et parsing de la date
  const birthday = new Date(birthdayInput);
  if (isNaN(birthday.getTime())) {
    return res.status(400).json({ error: "La date de naissance est invalide." });
  }

  // On met à jour l'animal
  animal.name = name;
  animal.birthday = birthday;
  animal.description = description;
  animal.picture = picture;

  try {
    await animal.save();
    res.status(200).json({ message: "Animal mis à jour avec succès", animal });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'animal : ", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

function validateAnimalId(id) {
  const animalId = Number(id);
  if (!Number.isInteger(animalId)) {
    return null;
  }
  return animalId;
}

export async function getMessages(req, res) {
  try {
    const messages = await User_animal.findAll({
    });
    res.json(messages);
  } catch(error) {
    console.error("Erreur lors de la récupération des animaux:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des animaux" });
  }
};

export async function getOneMessage(req, res) {
  const { userId, animalId } = req.params;

  try {
    const message = await User_animal.findOne({
      where: {
        user_id: parseInt(userId, 10),
        animal_id: parseInt(animalId, 10)
      }
    });

    if (!message) {
      return res.status(404).json({ 
        error: "Aucun message trouvé pour cet utilisateur et cet animal" 
      });
    }

    return res.status(200).json({ 
      data: message
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du message:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function createOneMessage(req, res) {
  const { userId, animalId } = req.params;
  const { message } = req.body;
  const newMessage = await User_animal.create({
    animal_id: parseInt(animalId),
    user_id: parseInt(userId),
    message
  });
  res.status(201).json(newMessage);
};


export async function createAnimal(req, res) {
  console.log("Requête createAnimal reçue", req.body);
  const { name, birthday, description, picture,species_id,  localisation_id, user_id } = req.body;
  
  // On vérifie que les champs requis sont présents
  if (!name || !birthday || !description || !picture) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  // Vérifier si l'utilisateur existe (l'association qui possède l'animal)
  const user = await User.findByPk(user_id);
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur non trouvé !' });
  }
  
  try {
    const newAnimal = await Animal.create({
      name,
      birthday,
      description,
      picture,
      species_id,
      localisation_id,
      user_id // l'association qui possède l'animal
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

  try {
    // vérification du message
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Le message ne peut pas être vide" });
    }
    
    // Création du message dans la base de données
    const newMessage = await User_animal.create({
      user_id: parseInt(userId, 10),
      animal_id: parseInt(animalId, 10),
      message
    });
    
    return res.status(201).json({ 
      message: "Message créé avec succès", 
      data: newMessage 
    });    
  } catch (error) {
    console.error("Erreur création message :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

