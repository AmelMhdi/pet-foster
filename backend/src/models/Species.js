import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelizeClient.js";

export class Species extends Model {}

Species.init(
{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique : true,
  },
}, {
  sequelize,
  modelName: "Species",
  tableName: "species",
});

export default Species;