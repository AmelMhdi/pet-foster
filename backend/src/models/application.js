import { DataTypes, Model } from "sequelize";

export class Application extends Model {}

Application.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "user", key: "id" },
		},
		animal_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "animal", key: "id" },
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: "pending", // Valeurs possibles : 'pending', 'approved', 'rejected'
		},
	},
	{
		sequelize,
		modelName: "Application",
		tableName: "application",
		timestamps: true,
	}
);	