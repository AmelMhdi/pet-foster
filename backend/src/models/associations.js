import { sequelize } from "./sequelizeClient.js";
import { User } from "./User.js";
import { Role } from "./Role.js";
import { Animal } from "./Animal.js";
import { Localisation } from "./Localisation.js";
import { Species } from "./Species.js";
import { User_animal } from "./User_animal.js";

Localisation.hasMany(Animal, {
  as: "animals", 
  foreignKey: {
    name: "localisation_id",
    allowNull: false,
  },
  onDelete: "CASCADE"
});
Animal.belongsTo(Localisation, {
  as: "localisation", 
  foreignKey: "localisation_id" 
});

Species.hasMany(Animal, {
  as: "animals",
  foreignKey: {
    name: "species_id",
    allowNull: false,
  },
  onDelete: "CASCADE"
});
Animal.belongsTo(Species, {
  as: "species", 
  foreignKey: "species_id" 
} );

User.hasMany(Animal, {
  as: "animals_asso",
  foreignKey: {
    name: "user_id",
    allowNull: false,
  },
  onDelete: "CASCADE"
});
Animal.belongsTo(User, {
  as: "asso",
  foreignKey: "user_id"
});

Role.hasMany(User, {
  as: "users",
  foreignKey: {
    name: "role_id",
    allowNull: false,
  },
  onDelete: "CASCADE"
});
User.belongsTo(Role, {
  as: "role",
  foreignKey: "role_id"
});

User.belongsToMany(Animal, {
  as: "animals_family",
  through: "User_animal",
  foreignKey: "user_id"
});

Animal.belongsToMany(User, {
  as: "families",
  through: "User_animal",
  foreignKey: "animal_id"
} );

Localisation.hasMany(User, {
  as: "users", 
  foreignKey: {
    name: "localisation_id",
    allowNull: false
  },
  onDelete: "CASCADE"
} );

User.belongsTo(Localisation, {
  as: "localisation", 
  foreignKey: "localisation_id" 
});


User_animal.belongsTo(User, {
  as: "user",
  foreignKey: "user_id"
});

User_animal.belongsTo(Animal, {
  as: "animal",
  foreignKey: "animal_id"
});

export { User, Role, Animal, Species, Localisation, User_animal, sequelize };