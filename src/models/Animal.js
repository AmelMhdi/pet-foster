import { Model, DataTypes } from 'sequelize';
import {sequelize} from './sequelizeClient.js';

export class Animal extends Model {}

  // On se rappelle : pas besoin de mettre l'ID, le created_at, le updated_at => c'est géré par Sequelize

Animal.init(
  {
    name: {
      type: DataTypes.STRING, // VARCHAR(255)
      allowNull: false, // NOT NULL
    },
      birthday: {
      type: DataTypes.DATE,
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
       
  },
  {
    sequelize,
    tableName: 'animal', 
  }
);