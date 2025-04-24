import '../utils/loadEnv.js'; // <- This comes avant tout !
import { sequelize } from '../models/sequelizeClient.js';
import { User, Animal, Role, Species, Localisation, User_animal } from '../models/index.js';

async function seed() {
  try {
    // Insert species
    const speciesList = ['Chien', 'Chat', 'Lapin'];
    const speciesInstances = [];
    for (const name of speciesList) {
      const species = await Species.create({ name });
      speciesInstances.push(species);
    }

    // Insert roles
    const roleList = ['admin', 'user'];
    const roleInstances = [];
    for (const name of roleList) {
      const role = await Role.create({ name });
      roleInstances.push(role);
    }

    // Créer une map pour accéder facilement aux IDs de rôles
    const roleMap = {};
    for (const role of roleInstances) {
      roleMap[role.name] = role.id;
    }

    // Insert localisations
    const localisations = [
      { city: 'Paris', postcode: 75000 },
      { city: 'Laval', postcode: 53000 },
    ];
    const localisationInstances = [];
    for (const loc of localisations) {
      const localisation = await Localisation.create(loc);
      localisationInstances.push(localisation);
    }

    // Map des localisations
    const localisationMap = {};
    for (const loc of localisationInstances) {
      localisationMap[loc.city] = loc.id;
    }

    // Insert users
    const users = [
      {
        firstname: 'Alice',
        lastname: 'Dupont',
        password: 'hashedpassword1',
        email: 'alice@example.com',
        address: '123 rue de Paris',
        phone_number: 123456789,
        rma_number: 'RMA001',
        role_id: roleMap['admin'],
      },
      {
        firstname: 'Bob',
        lastname: 'Martin',
        password: 'hashedpassword2',
        email: 'bob@example.com',
        address: '456 avenue des Lilas',
        phone_number: 987654321,
        rma_number: 'RMA002',
        role_id: roleMap['user'],
      },
    ];
    const userInstances = [];
    for (const user of users) {
      const newUser = await User.create(user);
      userInstances.push(newUser);
    }

    // Map des utilisateurs
    const userMap = {};
    for (const user of userInstances) {
      userMap[user.email] = user.id;
    }

    // Insert animals
    const animals = [
      {
        name: 'Rex',
        birthday: new Date('2020-05-20'),
        description: 'Un chien fidèle et joueur',
        picture: 'rex.jpg',
        species_id: speciesInstances[0].id,
        localisation_id: localisationMap['Paris'],
        user_id: userMap['alice@example.com'],
      },
      {
        name: 'Mina',
        birthday: new Date('2019-08-14'),
        description: 'Chat calme et affectueux',
        picture: 'mina.jpg',
        species_id: speciesInstances[1].id,
        localisation_id: localisationMap['Paris'],
        user_id: userMap['bob@example.com'],
      },
    ];
    const animalInstances = [];
    for (const animal of animals) {
      const newAnimal = await Animal.create(animal);
      animalInstances.push(newAnimal);
    }

    // Insert messages (user_animal)
    const messages = [
      {
        message: 'Je voudrais adopter Rex',
        userId: userMap['alice@example.com'],
        animalId: animalInstances[0].id,
      },
      {
        message: 'Mina est adorable !',
        userId: userMap['bob@example.com'],
        animalId: animalInstances[1].id,
      },
    ];
    for (const msg of messages) {
      await User_animal.create(msg);
    }

    console.log('\n✅ Seeding done!\n');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await sequelize.close();
  }
}

seed();
