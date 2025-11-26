import { sequelize } from "./sequelizeClient.js";
import User from "./User.js";
import Animal from "./Animal.js";
import Species from "./Species.js";
import Role from "./Role.js";
import Application from "./Application.js";

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

// USER (as association) - ANIMAL (owned by association)
User.hasMany(Animal, {
  as: "animals",
  foreignKey: {
    name: "user_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
Animal.belongsTo(User, {
  as: "owner",
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

// APPLICATION (standalone applications made by users for animals)
User.hasMany(Application, {
  as: "applications",
  foreignKey: {
    name: "user_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
Application.belongsTo(User, {
  as: "applicant",
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

// USER - ANIMAL (many-to-many through application)
User.belongsToMany(Animal, {
  through: Application, // animals a user applied for
  as: "applied_animals",
  foreignKey: "user_id",
  otherKey: "animal_id",
});
Animal.belongsToMany(User, {
  through: Application,
  as: "applicants", // users who applied for an animal
  foreignKey: "animal_id",
  otherKey: "user_id",
});

export { Animal, User, Species, Role, Application, sequelize };