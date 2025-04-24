import { sequelize } from "../models/index.js"; // Import du tunnel de connexion (pour fermeture en fin de script)
// Le sequelize a "conscience" des différents modèles

console.log("🗑️ Suppression des tables existantes..."); // Notamment pour relancer le script plusieurs fois si on veut faire un reset:db
await sequelize.drop();

console.log("🚧 Définition des tables..."); // Synchroniser le modèle séquelize avec la BDD, ie, RE-CREER la table à partir du modèle Sequelize
await sequelize.sync();

console.log("✅ Migration OK ! Fermeture de la base..."); // On ferme le tunnel de connexion pour que le script s'arrête bien
await sequelize.close();

