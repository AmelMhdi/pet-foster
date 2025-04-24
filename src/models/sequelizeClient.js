import '../utils/loadEnv.js';

import { Sequelize } from "sequelize";

// Notre client Sequelize
export const sequelize = new Sequelize(process.env.PG_URL, {
  define: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  },
  // logging: false
  logging: true
}); 

