import dotenv from 'dotenv';
import { Sequelize } from "sequelize";

dotenv.config();

export const sequelize = new Sequelize(process.env.PG_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
   retry: {
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
  define: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  },
  logging: console.log
});

sequelize.authenticate()
  .then(() => {
    console.log('✅ Connexion à la base de données réussie');
  })
  .catch(err => {
    console.error('❌ Impossible de se connecter à la base de données:', err);
  });