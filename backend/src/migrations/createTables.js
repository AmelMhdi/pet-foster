import { sequelize } from "../models/index.js"; // Importe l'instance sequelize configurée
import dotenv from "dotenv"; // Pour charger les variables d’environnement depuis le fichier .env
dotenv.config(); // Charge les variables d’environnement depuis le fichier .env

if (!process.env.PG_URL) {
  throw new Error("PG_URL is not defined");
}

console.log( 'PG_URL in createTables:', process.env.PG_URL ); // Pour vérifier que la variable d'environnement est bien chargée

console.log("🗑️ Suppression des tables existantes..."); // Pour relancer le script plusieurs fois si on veut faire un reset:db
await sequelize.drop(); // Supprime toutes les tables connues par Sequelize (toutes les données disparaissent)

console.log("🚧 Définition des tables..."); // Synchroniser le modèle séquelize avec la BDD, recréer la table à partir du modèle Sequelize
await sequelize.sync(); // Recrée les tables d’après les définitions des modèles

console.log("✅ Migration OK ! Fermeture de la base..."); // On ferme le tunnel de connexion pour que le script s'arrête correctement
await sequelize.close(); // Ferme le tunnel de connexion à Postgres (sinon le script risque de "pendre")

