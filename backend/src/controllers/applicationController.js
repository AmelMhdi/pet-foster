import { Application } from "../models/Application.js";

// Create a foster request
export async function createOneMessage(req, res, next) {
  console.log("🔥 createOneMessage a été appelé !");

  const { message } = req.body;
  const animalId = parseInt(req.params.animalId, 10);
  const userId = req.user.id;

  console.log("📩 createOneMessage reçu :", { userId, animalId, message });

  // Vérifier que l'utilisateur est authentifié
  if (!userId) {
    return res.status(401).json({ message: "Vous devez être connecté." });
  }

  // Vérifier que animalId est un entier valide
  if (!Number.isInteger(animalId) || isNaN(animalId)) {
    return res.status(400).json({ message: "ID de l'animal invalide." });
  }

  if (!message || !userId || !animalId) {
    console.warn("❌ Données manquantes pour createOneMessage :", { userId, animalId, message });
    return res.status(400).json({ error: "Données manquantes." });
  }

  if (typeof message !== "string") {
    return res.status(400).json({ message: "Le message doit être une chaîne de caractères." });
  }

  if (!message || message.trim().length === 0)
    return res.status(400).json({ message: "Le message ne peut pas être vide." });

  try {
    // Vérifier si une demande existe déjà pour cet utilisateur et cet animal
    const existing = await Application.findOne({
      where: { user_id: userId, animal_id: animalId }
    });

    if (existing) {
      return res.status(400).json({ message: "Vous avez déjà postulé pour cet animal." });
    }

    // Créer la demande
    const newApplication = await Application.create({
      user_id: userId,
      animal_id: animalId,
      message,
      status: "pending"
    })

    console.log("✅ Nouvelle demande d'accueil créée :", newApplication);

    return res.status(201).json({ message: "Demande d'accueil créée avec succès.", application: newApplication });
  } catch (error) {
    console.error("Erreur lors de la création de l'application", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

// Get a user's request to foster an animal
export async function getOneMessage(req, res, next) {
  const { userId, animalId } = req.params;

  if (!Number.isInteger(parseInt(userId)) || !Number.isInteger(parseInt(animalId))) {
    console.warn("❌ Mauvais paramètres pour getOneMessage :", { userId, animalId });
    return res.status(400).json({ error: "Paramètres invalides." });
  }

  try {
    const getMessage = await Application.findOne({
      where: { user_id: userId, animal_id: animalId },
      include: ["user", "animal"],
    });

    if (!message) return res.status(404).json({ error: "Message introuvable." });
    
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