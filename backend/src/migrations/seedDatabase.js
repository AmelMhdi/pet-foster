import { User, Animal, Role, Species, Localisation, User_animal } from '../models/index.js';
import argon2 from 'argon2';

const roles = [
  { name: "association"},
  { name: "famille d'accueil" }  
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
  { city: 'Nantes', postcode: 44000 },
  { city: 'Strasbourg', postcode: 67000 },
  { city: 'Lille', postcode: 59000 },
  { city: 'Rennes', postcode: 35000 },
  { city: 'Grenoble', postcode: 38000 },
  { city: 'Bordeaux', postcode: 33000 },
  { city: 'Montpellier', postcode: 34000 },
  { city: 'Dijon', postcode: 21000 },
  { city: 'Reims', postcode: 51100 },
  { city: 'Le Havre', postcode: 76600 }
];

const roleInstances = [];
for (const role of roles) {
  roleInstances.push(await Role.create(role));
}

const speciesInstances = [];
for (const s of species) {
  speciesInstances.push(await Species.create(s));
}

const localisationInstances = [];
for (const loc of localisations) {
  localisationInstances.push(await Localisation.create(loc));
}

const users = [
  {
    firstname: 'Alice',
    lastname: 'Durand',
    password: 'V6kRsd#defszeffr',
    email: 'alice.durand@example.com',
    address: '12 rue des Lilas',
    phone_number: "0612345678",
    rma_number: 'W123456789',
    localisation_id: localisationInstances[0].id,
    role_id: roleInstances[0].id,
    picture: '/images/alice.webp'
  },
  {
    firstname: 'Bruno',
    lastname: 'Martin',
    password: 'V6kRsd#defszeffr',
    email: 'bruno.martin@example.com',
    address: '34 avenue Victor Hugo',
    phone_number: "0623456789",
    rma_number: 'W223456789',
    localisation_id: localisationInstances[1].id,
    role_id: roleInstances[1].id,
    picture: '/images/bruno.webp'
  },
  {
    firstname: 'Claire',
    lastname: 'Les amis des bêtes',
    password: 'V6kRsd#defszeffr',
    email: 'claire.petit@example.com',
    address: '78 boulevard des Alpes',
    phone_number: "0634567890",
    rma_number: 'W323456789',
    localisation_id: localisationInstances[2].id,
    role_id: roleInstances[0].id 
  },
  {
    firstname: 'David',
    lastname: 'Lemoine',
    password: 'V6kRsd#defszeffr',
    email: 'david.lemoine@example.com',
    address: '9 impasse des Cèdres',
    phone_number: "0645678901",
    rma_number: 'W423456789',
    localisation_id: localisationInstances[3].id,
    role_id: roleInstances[1].id 
  },{
    firstname: 'Emma',
    lastname: 'Animalove',
    password: 'V6kRsd#defszeffr',
    email: 'emma.leroux@example.com',
    address: '5 rue des Oliviers',
    phone_number: '0651234567',
    rma_number: 'W523456789',
    localisation_id: localisationInstances[4].id,
    role_id: roleInstances[0].id
  },
  {
    firstname: 'Lucas',
    lastname: 'Moreau',
    password: 'V6kRsd#defszeffr',
    email: 'lucas.moreau@example.com',
    address: '18 rue du Pont Neuf',
    phone_number: '0652345678',
    rma_number: 'W623456789',
    localisation_id: localisationInstances[5].id,
    role_id: roleInstances[1].id
  },
  {
    firstname: 'Sophie',
    lastname: 'Une patte dans ma main',
    password: 'V6kRsd#defszeffr',
    email: 'sophie.garnier@example.com',
    address: '11 rue Lafayette',
    phone_number: '0653456789',
    rma_number: 'W723456789',
    localisation_id: localisationInstances[6].id,
    role_id: roleInstances[0].id
  },
  {
    firstname: 'Hugo',
    lastname: 'Bernard',
    password: 'V6kRsd#defszeffr',
    email: 'hugo.bernard@example.com',
    address: '9 chemin du Lavoir',
    phone_number: '0654567890',
    rma_number: 'W823456789',
    localisation_id: localisationInstances[7].id,
    role_id: roleInstances[1].id
  },
  {
    firstname: 'Julie',
    lastname: 'Oeil de chat',
    password: 'V6kRsd#defszeffr',
    email: 'julie.robert@example.com',
    address: '42 avenue des Champs',
    phone_number: '0655678901',
    rma_number: 'W923456789',
    localisation_id: localisationInstances[8].id,
    role_id: roleInstances[0].id
  },
  {
    firstname: 'Nathan',
    lastname: 'Roux',
    password: 'V6kRsd#defszeffr',
    email: 'nathan.roux@example.com',
    address: '27 allée des Chênes',
    phone_number: '0656789012',
    rma_number: 'W103456789',
    localisation_id: localisationInstances[9].id,
    role_id: roleInstances[1].id
  }
];

const userInstances = [];

try {
  for (const user of users) {
    user.password = await argon2.hash(user.password); 
    const instance = await User.create(user);
    console.log(`Utilisateur "${instance.firstname}" => ID: ${instance.id}`);
    userInstances.push(instance);
  }

} catch (error) {
  console.error("Erreur lors de l'insertion des utilisateurs : ", error);
}

const animals = [
  {
    name: 'Luna',
    birthday: new Date('2019-06-15'),
    description: 'Chienne très affectueuse et joueuse, adore les longues balades.',
    picture: '/images/luna.webp',
    localisation_id: localisationInstances[0].id,
    user_id: userInstances[0].id,
    species_id: speciesInstances[0].id
  },
  {
    name: 'Milo',
    birthday: new Date('2020-03-22'),
    description: 'Chat calme et discret, aime observer depuis la fenêtre.',
    picture: '/images/milo.webp',
    localisation_id: localisationInstances[1].id,
    user_id: userInstances[2].id,
    species_id: speciesInstances[1].id
  },
  {
    name: 'Coco',
    birthday: new Date('2021-08-10'),
    description: 'Perroquet bavard, capable de répéter plusieurs mots.',
    picture: '/images/coco.webp',
    localisation_id: localisationInstances[2].id,
    user_id: userInstances[2].id,
    species_id: speciesInstances[3].id
  },
  {
    name: 'Nala',
    birthday: new Date('2018-11-05'),
    description: 'Lapine curieuse qui adore grignoter des légumes frais.',
    picture: '/images/nala.webp',
    localisation_id: localisationInstances[3].id,
    user_id: userInstances[2].id,
    species_id: speciesInstances[2].id
  },
  {
    name: 'Oscar',
    birthday: new Date('2020-09-01'),
    description: 'Chien joueur et énergique, idéal pour famille avec enfants.',
    picture: '/images/oscar.webp',
    localisation_id: localisationInstances[0].id,
    user_id: userInstances[4].id,
    species_id: speciesInstances[0].id
  },
  {
    name: 'Misty',
    birthday: new Date('2021-12-25'),
    description: 'Chatte douce et timide, aime les coins tranquilles.',
    picture: '/images/misty.webp',
    localisation_id: localisationInstances[1].id,
    user_id: userInstances[0].id,
    species_id: speciesInstances[1].id
  },
  {
    name: 'Bubbles',
    birthday: new Date('2022-01-05'),
    description: 'Petit hamster vif et curieux.',
    picture: '/images/bubbles.webp',
    localisation_id: localisationInstances[2].id,
    user_id: userInstances[6].id,
    species_id: speciesInstances[4].id
  },
  {
    name: 'Titi',
    birthday: new Date('2020-05-14'),
    description: 'Lapin nain doux, aime les câlins.',
    picture: '/images/titi.webp',
    localisation_id: localisationInstances[3].id,
    user_id: userInstances[4].id,
    species_id: speciesInstances[2].id
  },
  {
    name: 'Simba',
    birthday: new Date('2019-11-30'),
    description: 'Chien croisé très sociable avec ses congénères.',
    picture: '/images/simba.webp',
    localisation_id: localisationInstances[4].id,
    user_id: userInstances[8].id,
    species_id: speciesInstances[0].id
  },
  {
    name: 'Nemo',
    birthday: new Date('2023-02-10'),
    description: 'Petit hamster très vif, adore courir dans sa roue.',
    picture: '/images/nemo.webp',
    localisation_id: localisationInstances[5].id,
    user_id: userInstances[4].id,
    species_id: speciesInstances[4].id
  },
  {
    name: 'Caramel',
    birthday: new Date('2018-07-07'),
    description: 'Lapin bélier très câlin.',
    picture: '/images/caramel.webp',
    localisation_id: localisationInstances[6].id,
    user_id: userInstances[4].id,
    species_id: speciesInstances[2].id
  },
  {
    name: 'Rio',
    birthday: new Date('2021-04-16'),
    description: 'Perroquet aux couleurs éclatantes.',
    picture: '/images/rio.webp',
    localisation_id: localisationInstances[7].id,
    user_id: userInstances[6].id,
    species_id: speciesInstances[3].id
  },
  {
    name: 'Twix',
    birthday: new Date('2020-03-03'),
    description: 'Hamster curieux et actif la nuit.',
    picture: '/images/twix.webp',
    localisation_id: localisationInstances[8].id,
    user_id: userInstances[6].id,
    species_id: speciesInstances[4].id
  },
  {
    name: 'Félix',
    birthday: new Date('2017-02-20'),
    description: 'Chat noir élégant et indépendant.',
    picture: '/images/felix.webp',
    localisation_id: localisationInstances[9].id,
    user_id: userInstances[8].id,
    species_id: speciesInstances[1].id
  }
];

const animalInstances = [];
for (const animal of animals) {
  animalInstances.push(await Animal.create(animal));
}

const user_animals = [
  {
    message: "Je suis très proche de Luna.",
    user_id: userInstances[1].id,
    animal_id: animalInstances[0].id,
    createdAt: "2024-05-01T10:00:00Z",
    updatedAt: "2024-05-01T10:00:00Z"
  },
  {
    message: "Milo est un vrai pot de colle.",
    user_id: userInstances[3].id, 
    animal_id: animalInstances[0].id,
    createdAt: "2024-05-02T10:01:00Z",
    updatedAt: "2024-05-02T10:01:00Z"
  },
  {
    message: "Misty a l'air adorable.",
    user_id: userInstances[1].id,
    animal_id: animalInstances[5].id,
    createdAt: "2024-05-03T10:01:00Z",
    updatedAt: "2024-05-03T10:01:00Z"
  }
];

try {
  await Promise.all(user_animals.map(user_animal => User_animal.create(user_animal)));
  console.log("Associations insérées avec succès !");
} catch (error) {
  console.error("Erreur lors de l'insertion des associations : ", error);
}

console.log('Données fictives insérées avec succès !');