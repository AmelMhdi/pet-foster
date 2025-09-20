import { User } from "../models/index.js"; // User : modèle Sequelize de la table User. On s’en sert pour interroger la BDD
import { Op } from "sequelize"; // Op : les opérateurs Sequelize (ici, Op.or) qui permettent d’écrire des conditions SQL avancées

/* Fonction asynchrone : elle attend une réponse de la BDD
Paramètres :
- email → l’email soumis par le nouvel utilisateur (ou lors d’une modification)
- phone_number → son numéro de téléphone
- userId (optionnel) → utilisé lorsqu’on met à jour un utilisateur, pour éviter de comparer la personne à elle-même
*/
export async function checkDuplicates(email, phone_number, userId = null) {
  // Traduction SQL de la requête Sequelize ci-dessous :
  // SELECT * FROM User
  // WHERE email = :email OR phone_number = :phone_number
  // LIMIT 1;
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ email }, { phone_number }],
    },
  }); // on regarde si un utilisateur existe déjà avec cet email ou ce numéro

  // Si un utilisateur existe déjà, et que ce n’est pas la même personne (userId),
  // on prépare un tableau de messages d’erreur (un pour l’email, un pour le téléphone)
  // et on lance une erreur avec le message complet
  if (existingUser && existingUser.id !== userId) {
    const conflicts = [];

    if (existingUser.email === email) {
      conflicts.push("Cet email est déjà utilisé.");
    }

    if (existingUser.phone_number === phone_number) {
      conflicts.push("Ce numéro de téléphone est déjà utilisé.");
    }

    if (conflicts.length) {
      const error = new Error(conflicts.join(" ")); // Si on a trouvé au moins un conflit, on crée une erreur personnalisée
      error.statusCode = 409; // 409 Conflict : conflit avec l’état actuel de la ressource (ici, l’utilisateur existe déjà)
      throw error; // on lance l’erreur pour qu’elle soit gérée par le middleware d’erreur global
    }
  }
}

/*
Ce validateur sert à vérifier, lors d’une inscription ou modification de profil, qu’aucun autre utilisateur n’a déjà utilisé le même email ou numéro de téléphone.
Il interroge la base avec Sequelize, détecte les doublons, et renvoie une erreur 409 Conflict si besoin. Cela garantit l’unicité des champs critiques comme l’email et le téléphone.
*/