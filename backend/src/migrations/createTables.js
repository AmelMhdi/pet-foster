import { sequelize } from "../models/index.js";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.PG_URL) {
  throw new Error("PG_URL is not defined");
}

console.log('PG_URL dans le script createTables :', process.env.PG_URL);

async function resetDatabase() {
  try {
    console.log("🗑️ Suppression des tables existantes...");
    // DROP toutes les tables connues par Sequelize avec CASCADE
    await sequelize.getQueryInterface().dropAllTables({ cascade: true });

    console.log("🚧 Création des tables...");
    await sequelize.sync({ force: true });

    console.log("✅ Migration OK ! Fermeture de la base...");
    await sequelize.close();
  } catch (error) {
    console.error("Erreur lors du reset de la base : ", error);
    process.exit(1);
  }
}

resetDatabase();