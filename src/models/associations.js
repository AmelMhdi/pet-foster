// Importer nos modèles
import { sequelize } from "./sequelizeClient.js";
import { User } from "./User.js";
import { Role } from "./Role.js";
import { Animal } from "./Animal.js";
import { Localisation } from "./Localisation.js";
import { Species } from "./Species.js";
import { User_animal } from "./User_animal.js";

// Animal <--> Localisation (One-to-Many)
Localisation.hasMany(Animal, {
  as: "animals", // alias, permet de faire les 'include' sans avoir à importer le deuxième modèle. // On choisi la valeur pour cet alias, mais en pratique, répondre à la questio: "quand je requête une localisation, je veux pouvoir récupérer ses..."
  foreignKey: {
    name: "localisation_id",
    allowNull: false,
  },
  onDelete: "CASCADE"
});
Animal.belongsTo(Localisation, {
  as: "localisation", // Quand je requête une animal, je veux pouvoir récupérer... sa localisation
  foreignKey: "localisation_id" // obligatoire, sinon il créé un champ  dont on ne veut pas
});


// Animal <--> Species (One-to-Many)
Species.hasMany(Animal, {
  as: "animals", // alias, permet de faire les 'include' sans avoir à importer le deuxième modèle. // On choisi la valeur pour cet alias, mais en pratique, répondre à la questio: "quand je requête une espèce, je veux pouvoir récupérer ses..."
  foreignKey: {
    name: "species_id",
    allowNull: false,
  },
  onDelete: "CASCADE"
});
Animal.belongsTo(Species, {
  as: "species", // Quand je requête une animal, je veux pouvoir récupérer... son espèce
  foreignKey: "species_id" // obligatoire, sinon il créé un champ dont on ne veut pas
} );


// Animal <--> User (One-to-Many) asso
User.hasMany(Animal, {
  as: "animals_asso", // alias, permet de faire les 'include' sans avoir à importer le deuxième modèle. // On choisi la valeur pour cet alias, mais en pratique, répondre à la questio: "quand je requête un user, je veux pouvoir récupérer ses..."
  foreignKey: {
    name: "user_id",
    allowNull: false,
  },
  onDelete: "CASCADE"
});
Animal.belongsTo(User, {
  as: "asso", // Quand je requête une animal, je veux pouvoir récupérer... ses users
  foreignKey: "user_id" // obligatoire, sinon il créé un champ dont on ne veut pas
});


// Role <--> User (One-to-Many)
Role.hasMany(User, {
  as: "users", // alias, permet de faire les 'include' sans avoir à importer le deuxième modèle. // On choisi la valeur pour cet alias, mais en pratique, répondre à la questio: "quand je requête une localisation, je veux pouvoir récupérer ..."
  foreignKey: {
    name: "role_id",
    allowNull: false,
  },
  onDelete: "CASCADE"
});
User.belongsTo(Role, {
  as: "role", // Quand je requête un user, je veux pouvoir récupérer... son role
  foreignKey: "role_id" // obligatoire, sinon il créé un champ dont on ne veut pas
});

// User <--> Animal (Many-to-Many)
User.belongsToMany(Animal, {
  as: "animals_family",
  through: "User_animal",
  foreignKey: "user_id"
});

Animal.belongsToMany(User, {
  as: "families",
  through: "User_animal",
  foreignKey: "animal_id"
});

// Exporter nos modèles
export { User, Role, Animal, Species, Localisation, User_animal,sequelize };
