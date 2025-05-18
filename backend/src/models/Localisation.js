import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelizeClient.js";

export class Localisation extends Model {}

Localisation.init({
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },

  postcode: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: "localisation"
});