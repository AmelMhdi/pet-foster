import { User, Animal, Role, Species, Localisation, User_Animal } from "../models/associations.js";

console.log("🔄 Synchronisation de la base de données...");
await Role.sync({ force: true });
await Species.sync({ force: true });
await Localisation.sync({ force: true });
await User.sync({ force: true });
await Animal.sync({ force: true });
await User_Animal.sync({ force: true });
console.log("✅ Base synchronisée avec succès !");

console.log("🚀 Insertion des données de test...");

console.log("📌 Création des rôles...");
const adminRole = await Role.create({ id: 1, name: "Admin" });
const associationRole = await Role.create({ id: 2, name: "Association" });
const userRole = await Role.create({ id: 3, name: "User" });

console.log("📌 Création des espèces...");
const chien = await Species.create({ id: 1, name: "Chien" });
const chat = await Species.create({ id: 2, name: "Chat" });

console.log("📌 Création des localisations...");
const paris = await Localisation.create({ id: 1, name: "Paris", postcode: 75000 });
const lyon = await Localisation.create({ id: 2, name: "Lyon", postcode: 69000 });

console.log("📌 Création des utilisateurs...");
const alice = await User.create({
  id: 1,
  first_name: "Alice",
  last_name: "Durand",
  phone_number: 123456789,
  password: "hashed_pwd_1",
  email: "alice@example.com",
  address: "10 rue des Lilas",
  postcode: 75000,
  city: "Paris",
  RNA_number: "RNA12345",
  role_id: associationRole.id,
});

const bob = await User.create({
  id: 2,
  first_name: "Bob",
  last_name: "Martin",
  phone_number: 987654321,
  password: "hashed_pwd_2",
  email: "bob@example.com",
  address: "5 avenue de Lyon",
  postcode: 69000,
  city: "Lyon",
  RNA_number: null,
  role_id: userRole.id,
});

console.log("📌 Création des animaux...");
const rex = await Animal.create({
  id: 1,
  name: "Rex",
  date_of_birth: 20200101,
  description: "Chien très gentil",
  picture: "rex.jpg",
  localisation_id: paris.id,
  user_id: alice.id,
  species_id: chien.id,
});

const mimi = await Animal.create({
  id: 2,
  name: "Mimi",
  date_of_birth: 20190215,
  description: "Chat câlin",
  picture: "mimi.jpg",
  localisation_id: lyon.id,
  user_id: bob.id,
  species_id: chat.id,
});

console.log("📌 Création des candidatures User_Animal...");
await User_Animal.create({
  user_id: bob.id,
  animal_id: rex.id,
  message: "Je souhaite adopter Rex."
});

await User_Animal.create({
  user_id: alice.id,
  animal_id: mimi.id,
  message: "Mimi serait parfaite pour ma famille."
});

console.log("✅ Données de test insérées !");