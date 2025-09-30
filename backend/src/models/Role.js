import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelizeClient.js";

export class Role extends Model {}

Role.init(
{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique : true
  },
}, {
  sequelize,
  modelName: "Role",
  tableName: "role",
});

export default Role;