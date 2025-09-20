import pkg from 'pg'; // drive officiel PostgreSQL pour Node.js
import dotenv from 'dotenv'; // permet de charger les variables d'environnement

// charge .env et rend disponible process.env.DATABASE_URL
// permet de ne pas mettre en dur le mot de passe ou les infos de connexion à la BDD dans le code
dotenv.config();

// création d'un pool de connexions PostgreSQL
// au lieu de se connecter/déconnecter à chaque requête, on garde un “pool” de connexions ouvertes pour améliorer les performances
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // contient les infos nécessaires à la connexion : host, port, user, password, database.
  ssl: {
    rejectUnauthorized: false, // option souvent nécessaire si on déploie sur un service cloud comme Heroku ou Railway (ils imposent SSL).
  },
});

// test de la connexion
// dès que le serveur démarre, on essaie de se connecter à la BDD
pool.connect()
  .then(() => console.log("✅ Connecté à PostgreSQL")) // si c'est connecté, on log un message de succès
  .catch(err => console.error("❌ Erreur de connexion DB :", err)); // si erreur, on log l'erreur

// on exporte le pool pour pouvoir l'utiliser dans les autres fichiers
// il servira à exécuter les requêtes SQL avec pool.query(...)
export default pool;

/*
  Ce fichier s’occupe de la connexion à la base de données PostgreSQL
 */