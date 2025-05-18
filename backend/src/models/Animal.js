import { Model, DataTypes } from 'sequelize';
import {sequelize} from './sequelizeClient.js';

export class Animal extends Model {}

Animal.init(
  {
    name: {
      type: DataTypes.STRING, 
      allowNull: false,
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