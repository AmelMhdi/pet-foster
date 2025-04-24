import '../utils/loadEnv.js';
import { sequelize } from '../models/sequelizeClient.js';
import { User, Animal, Role, Species, Localisation, User_animal } from '../models/index.js';

await sequelize.sync({ force: true }); // Reset la DB (optionnel selon contexte)

const roles = [
  { name: 'admin' },
  { name: 'moderator' },
  { name: 'user' },
  { name: 'guest' }
];

const species = [
  { name: 'Chien' },
  { name: 'Chat' },
  { name: 'Lapin' },
  { name: 'Perroquet' },
  { name: 'Hamster' }
];

const localisations = [
  { city: 'Paris', postcode: 75001 },
  { city: 'Lyon', postcode: 69002 },
  { city: 'Marseille', postcode: 13008 },
  { city: 'Toulouse', postcode: 31000 },
  { city: 'Nantes', postcode: 44000 }
];

// Création des rôles
const roleInstances = [];
for (const role of roles) {
  roleInstances.push(await Role.create(role));
}

// Création des espèces
const speciesInstances = [];
for (const s of species) {
  speciesInstances.push(await Species.create(s));
}

// Création des localisations
const localisationInstances = [];
for (const loc of localisations) {
  localisationInstances.push(await Localisation.create(loc));
}

const users = [
  {
    firstname: 'Alice',
    lastname: 'Durand',
    password: 'hashedpassword1',
    email: 'alice.durand@example.com',
    address: '12 rue des Lilas',
    phone_number: "0612345678",
    rma_number: 'RMA2024001',
    postcode: 75001,
    city: 'Paris',
    role_id: roleInstances[2].id // user
  },
  {
    firstname: 'Bruno',
    lastname: 'Martin',
    password: 'hashedpassword2',
    email: 'bruno.martin@example.com',
    address: '34 avenue Victor Hugo',
    phone_number: "0623456789",
    rma_number: 'RMA2024002',
    postcode: 69002,
    city: 'Lyon',
    role_id: roleInstances[2].id
  },
  {
    firstname: 'Claire',
    lastname: 'Petit',
    password: 'hashedpassword3',
    email: 'claire.petit@example.com',
    address: '78 boulevard des Alpes',
    phone_number: "0634567890",
    rma_number: 'RMA2024003',
    postcode: 38000,
    city: 'Grenoble',
    role_id: roleInstances[1].id // moderator
  },
  {
    firstname: 'David',
    lastname: 'Lemoine',
    password: 'hashedpassword4',
    email: 'david.lemoine@example.com',
    address: '9 impasse des Cèdres',
    phone_number: "0645678901",
    rma_number: 'RMA2024004',
    postcode: 13008,
    city: 'Marseille',
    role_id: roleInstances[0].id // admin
  }
];

const userInstances = [];
for (const user of users) {
  userInstances.push(await User.create(user));
}

const animals = [
  {
    name: 'Luna',
    birthday: new Date('2019-06-15'),
    description: 'Chienne très affectueuse et joueuse, adore les longues balades.',
    picture: 'luna.jpg',
    localisation_id: localisationInstances[0].id,
    user_id: userInstances[0].id,
    species_id: speciesInstances[0].id
  },
  {
    name: 'Milo',
    birthday: new Date('2020-03-22'),
    description: 'Chat calme et discret, aime observer depuis la fenêtre.',
    picture: 'milo.png',
    localisation_id: localisationInstances[1].id,
    user_id: userInstances[1].id,
    species_id: speciesInstances[1].id
  },
  {
    name: 'Coco',
    birthday: new Date('2021-08-10'),
    description: 'Perroquet bavard, capable de répéter plusieurs mots.',
    picture: 'coco.jpeg',
    localisation_id: localisationInstances[2].id,
    user_id: userInstances[2].id,
    species_id: speciesInstances[3].id
  },
  {
    name: 'Nala',
    birthday: new Date('2018-11-05'),
    description: 'Lapine curieuse qui adore grignoter des légumes frais.',
    picture: 'nala.jpg',
    localisation_id: localisationInstances[3].id,
    user_id: userInstances[3].id,
    species_id: speciesInstances[2].id
  }
];

const animalInstances = [];
for (const animal of animals) {
  animalInstances.push(await Animal.create(animal));
}

// Exemple d'association User_Animal
const user_animals = [
  {
    message: "Je suis très proche de Luna.",
    user_id: userInstances[0].id,
    animal_id: animalInstances[0].id
  },
  {
    message: "Milo est un vrai pot de colle.",
    user_id: userInstances[1].id,
    animal_id: animalInstances[1].id
  }
];

for (const user_animal of user_animals) {
  await User_animal.create(user_animal);
}

console.log('✅ Données fictives insérées avec succès !');
