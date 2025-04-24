import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelizeClient.js";

export class User_animal extends Model {}

User_animal.init( {
    user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  animal_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: "user_animal"
});

