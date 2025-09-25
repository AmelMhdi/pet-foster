import { Application } from "../models/Application.js";

// Create a foster request
export async function createOneMessage(req, res, next) {
  const animalId = parseInt(req.params.animalId, 10);
  const userId = parseInt(req.params.userId, 10);
  const { message } = req.body;

  if (!Number.isInteger(animalId) || !Number.isInteger(userId))
    return res.status(400).json({ message: "ID invalide." });

  if (!message || message.trim().length === 0)
    return res.status(400).json({ message: "Le message ne peut pas être vide." });

  try {
    const [messageInstance] = await Application.upsert({
      animal_id: animalId,
      user_id: userId,
      message,
      status: "pending",
    });

    if (req.user.id !== messageInstance.user_id)
      return res.status(403).json({ message: "Action non autorisée." });

    res.status(201).json({ message: "Message créé avec succès.", data: messageInstance });
  } catch (error) {
    console.error(error);
    error.statusCode = 500;
    error.message = "Erreur serveur.";
    next(error);
  }
}

// Get a user's request to foster an animal
export async function getOneMessage(req, res, next) {
  const { animalId, userId } = req.params;
  
  try {
    const getMessage = await Application.findOne({
      where: { user_id: userId, animal_id: animalId },
      include: ["user", "animal"],
    });

    if (!getMessage) return next();

    res.status(200).json({
      message: getMessage.message,
      user: {
        first_name: getMessage.user.first_name,
        last_name: getMessage.user.last_name,
      },
      animal: { name: getMessage.animal.name },
      created_at: getMessage.created_at,
    });
  } catch (error) {
    console.error(error);
    error.statusCode = 500;
    error.message = "Erreur interne du serveur.";
    next(error);
  }
}