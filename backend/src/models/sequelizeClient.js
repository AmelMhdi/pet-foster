import dotenv from "dotenv"; // Pour charger les variables d’environnement depuis le fichier .env
import { Sequelize } from "sequelize"; // Import de la classe Sequelize (le tunnel de connexion)
dotenv.config(); // Charge les variables d’environnement depuis le fichier .env

if (!process.env.PG_URL) {
  throw new Error("PG_URL is not defined");
}

export const sequelize = new Sequelize(process.env.PG_URL, { // Crée une instance connectée à la base Postgres, grâce à l’URL définie dans .env
  dialect: 'postgres', // précise qu'on utilise PostgreSQL
  // dialectOptions: {
  //   ssl: { // Sécurise la connexion (utile sur des serveurs distants comme Render, Railway, Heroku)
  //     require: true,
  //     rejectUnauthorized: false
  //   }
  // },
  pool: { // configure un pool de connexions
    max: 5, // nombre max de connexions dans le pool
    min: 0, // nombre min de connexions dans le pool
    acquire: 30000, // durée max (en ms) pour obtenir une connexion avant de générer une erreur
    idle: 10000 // durée max (en ms) qu'une connexion peut être inactive avant d'être fermée
  },
   retry: { // règle les erreurs de connexion temporaires (Sequelize va retenter jusqu’à 3 fois)
    match: [
      /ConnectionError/,
      /ConnectionTimedOutError/,
      /TimeoutError/,
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/
    ],
    max: 3
  },
  define: { // applique des règles globales aux modèles
    createdAt: "created_at",
    updatedAt: "updated_at",
    underscored: true // Pour que Sequelize utilise le snake_case pour les champs de timestamps (created_at, updated_at)
  },
  logging: false // désactive l’affichage des requêtes SQL dans la console
});

/*
Fichier de configuration pour initialiser et exporter une instance Sequelize. Cette instance est utilisée pour :
- gérer la connexion à la base de données,
- appliquer des options (timestamps, noms de colonnes, etc.),
- permettre aux modèles de s’y rattacher.
*/