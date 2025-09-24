import { Animal, User } from "./index.js";
import { sequelize } from "./sequelizeClient.js";

// ROLE - USER
Role.hasMany(User, {
  as: "users",
  foreignKey: {
    name: "role_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
})
User.belongsTo(Role, {
  as: "role",
  foreignKey: "role_id",
});

// USER (as association) - ANIMAL
User.hasMany(Animal, {
  as: "animals",
  foreignKey: {
    name: "user_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
Animal.belongsTo(User, {
  as: "user",
  foreignKey: "user_id",
});

// SPECIES - ANIMAL
Species.hasMany(Animal, {
  as: "animals",
  foreignKey: {
    name: "species_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
Animal.belongsTo(Species, {
  as: "species",
  foreignKey: "species_id",
});

// APPLICATION (un utilisateur fait plusieurs demandes d'adoption)
User.hasMany(Application, {
  as: "applications",
  foreignKey: {
    name: "user_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
Application.belongsTo(User, {
  as: "user",
  foreignKey: "user_id",
});

Animal.hasMany(Application, {
  as: "applications",
  foreignKey: {
    name: "animal_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
Application.belongsTo(Animal, {
  as: "animal",
  foreignKey: "animal_id",
});

export { Animal, User, Localisation, Species, Role, Application, sequelize };