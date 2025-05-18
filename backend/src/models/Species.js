import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelizeClient.js";

export class Species extends Model {}

Species.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique : true
  },
}, {
  sequelize,
  tableName: "species"
});