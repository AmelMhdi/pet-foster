import dotenv from 'dotenv';
import { Sequelize } from "sequelize";

dotenv.config();

export const sequelize = new Sequelize(process.env.PG_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  define: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  },

  logging: false
}); 