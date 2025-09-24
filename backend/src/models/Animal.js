import { Model, DataTypes } from 'sequelize';
import {sequelize} from './sequelizeClient.js';

export class Animal extends Model {}

Animal.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY, // DATEONLY pour ne pas avoir l'heure
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "user", key: "id" },
    },
    species_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "species", key: "id" },
    },
  },
  {
    sequelize,
    modelName: "Animal",
    tableName: "animal",
    timestamps: true,
    underscored: true, // Pour que Sequelize utilise le snake_case pour les champs de timestamps (created_at, updated_at)
  }
);