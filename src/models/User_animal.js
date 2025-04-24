import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelizeClient.js";

export class User_animal extends Model {}

User_animal.init({
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: "user_animal"
});
