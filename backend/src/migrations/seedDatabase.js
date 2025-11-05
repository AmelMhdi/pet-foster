import { User, Animal, Role, Species, Application } from '../models/index.js';
import argon2 from 'argon2';

const roles = [
  { name: "Admin" },
  { name: "Association" },
  { name: "FamilleAccueil" }
];

const species = [
  { name: "Chien" },
  { name: "Chat" },
];

const roleInstances = [];
for (const role of roles) {
  roleInstances.push(await Role.create(role));
}

const speciesInstances = [];
for (const s of species) {
  speciesInstances.push(await Species.create(s));
}

const users = [
  {
    first_name: "Anya",
    last_name: "Joy",
    password: "hashed_pwd_1",
    email: "anya@gmail.com",
    phone_number: "0123456789",
    street_number: "10",
    address: "rue des Lilas",
    city: "Paris",
    zip_code: "75000",
    rna_number: "RNA12345",
    role_id: roleInstances[1].id // Association
  },
  {
    first_name: "Joon",
    last_name: "Kim",
    password: "hashed_pwd_2",
    email: "joon@gmail.com",
    phone_number: "0987654321",
    street_number: "5",
    address: "avenue de Lyon",
    city: "Lyon",
    zip_code: "69000",
    rna_number: null,
    role_id: roleInstances[2].id  // FamilleAccueil
  },
];

const userInstances = [];

try {
  for (const user of users) {
    user.password = await argon2.hash(user.password); 
    const instance = await User.create(user);
    console.log(`Utilisateur "${instance.first_name}" => ID: ${instance.id}`);
    userInstances.push(instance);
  }
} catch (error) {
  console.error("Erreur lors de l'insertion des utilisateurs : ", error);
}

const animals = [
  {
    name: "Rex",
    date_of_birth: new Date("2020-01-01"),
    description: "Chien très gentil",
    picture: "rex",
    user_id: userInstances[0].id,  // Anya (Association)
    species_id: speciesInstances[0].id  // Chien
  },
  {
    name: "Mimi",
    date_of_birth: new Date("2019-02-15"),
    description: "Chat câlin",
    picture: "mimi",
    user_id: userInstances[0].id,  // Anya (Association)
    species_id: speciesInstances[1].id  // Chat
  },
  {
    name: "Luna",
    date_of_birth: new Date("2021-06-10"),
    description: "Jeune chienne joueuse",
    picture: "luna",
    user_id: userInstances[0].id,  // Anya (Association)
    species_id: speciesInstances[1].id  // Chat
  },
  {
    name: "Félix",
    date_of_birth: new Date("2018-11-20"),
    description: "Chat indépendant",
    picture: "felix",
    user_id: userInstances[0].id,  // Anya (Association)
    species_id: speciesInstances[1].id  // Chat
  },
  {
    name: "Misty",
    date_of_birth: new Date("2017-05-05"),
    description: "Chat énergique",
    picture: "misty",
    user_id: userInstances[0].id,  // Anya (Association)
    species_id: speciesInstances[1].id  // Chat
  },
  {
    name: "Oscar",
    date_of_birth: new Date("2016-09-30"),
    description: "Chien fidèle",
    picture: "oscar",
    user_id: userInstances[0].id,  // Anya (Association)
    species_id: speciesInstances[0].id  // Chien
  },
];

const animalInstances = [];
try {
  for (const animal of animals) {
    const instance = await Animal.create(animal);
    console.log(`Animal "${instance.name}" => ID: ${instance.id}`);
    animalInstances.push(instance);
  }
} catch (error) {
  console.error("Erreur lors de l'insertion des animaux : ", error);
}

const applications = [
  {
    user_id: userInstances[1].id, // Joon (FamilleAccueil)
    animal_id: animalInstances[0].id, // Rex
    message: "Je souhaite adopter Rex car j'aime les chiens.",
    status: "pending"
  },
  {
    user_id: userInstances[1].id, // Joon (FamilleAccueil)
    animal_id: animalInstances[1].id, // Mimi
    message: "Je souhaite adopter Mimi car j'adore les chats.",
    status: "pending"
  },
];
try {
  await Promise.all(applications.map(application => Application.create(application)));
  console.log('Candidatures insérées avec succès !');
} catch (error) {
  console.error("Erreur lors de l'insertion des candidatures : ", error);
}

console.log('Données fictives insérées avec succès !');