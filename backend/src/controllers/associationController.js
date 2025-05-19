import { User, User_animal } from "../models/index.js";

/**
 * Fonction qui permet de récuperer les animaux en fonction d'une association
 */

export async function getAllAnimalsByAssociation(req, res, next) {
  const userId = parseInt(req.params.id);
  if (!Number.isInteger(userId)) {
    return next;
  }

  const user = await User.findByPk(userId, {
    include: {
      association: "animals_asso",
      include: {
        association: "species",
      },
    },
  });

  if (!user) {
    return next();
  }
  res.status(200).json(user.animals_asso);
}

export async function getMessagesForAssociation(req, res, next) {
  const user_id = req.user?.id;
  if (!user_id) {
    return res.status(401).json({ error: "Utilisateur non authentifié" });
  }

  const associationId = parseInt(req.params.id);

  const getMessages = await User_animal.findAll({
    include: [
      {
        association: "animal",
        where: { user_id: associationId }, 
      },
      {
        association: "user", 
      },
    ],
  });

  if (!getMessages) {
    return next();
  }

  const formatted = getMessages.map((demande) => {

    return {
      message: demande.message,
      userId: demande.user.id,
      firstname: demande.user.firstname,
      name: demande.user.lastname,
      email: demande.user.email,
      phone: demande.user.phone_number,
      animal: demande.animal.name,
      createdAt: new Date(demande.created_at).toISOString(),
    };
  });

  return res.status(200).json(formatted);
}

export async function getAllAssociations(req, res) {
  try {
    const associations = await User.findAll({
      include: [
        {
          association: "role",
          where: { id: 1 },
        },
        {
          association: "localisation",
        },
      ],
      attributes: { exclude: ["firstname", "password", "email", "address", "phone_number", "rma_number"]}
    });
    res.json(associations);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des associations." });
  }
}

export async function getOneAssociation(req, res, next) {
  const associationId = parseInt(req.params.id);

  const association = await User.findByPk(associationId, {
    attributes: ["firstname", "lastname", "email", "phone_number"],
    include: [
      {
        association: "animals_asso",
        attributes: ["id", "name", "picture"],
        include: [
          {
            association: "species",
            attributes: ["name"],
          },
        ],
      },
    ],
  });

  if (!association) {
    return next();
  }
  res.json(association);
}