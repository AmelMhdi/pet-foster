import { Model, DataTypes } from 'sequelize';
import {sequelize} from './sequelizeClient.js';

export class User extends Model {}

User.init(
  {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,  
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
      
    phone_number: {  
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
    },
    rma_number: {   
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'user', 
  }
);

/**
 * A User
 * @typedef  {object} User
 * @property {string} id.required - Identifier (géré automatiquement par Sequelize)
 * @property {string} username.required - Username
 * @property {string} password.required - Password
 * @property {string} email.required - Email
 */
