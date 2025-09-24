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
  timestamps: true,
  underscored: true, // Pour que Sequelize utilise le snake_case pour les champs de timestamps (created_at, updated_at)
});