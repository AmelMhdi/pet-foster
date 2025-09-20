import argon2 from "argon2"; // une librairie moderne et sécurisée pour le hachage des mots de passe
import jwt from "jsonwebtoken"; // une librairie pour créer et vérifier des JSON Web Tokens (JWT) pour l’authentification
import dotenv from "dotenv"; // pour charger les variables d’environnement depuis un fichier .env

dotenv.config(); // charge les variables d’environnement au début

export async function hash(password) { // Prend un mot de passe en clair (password)
  return await argon2.hash(password); // Utilise argon2.hash() pour produire une version hachée du mot de passe
}

// Compare un mot de passe fourni par l’utilisateur (plainTextPassword) avec le mot de passe stocké en base (hashedPassword)
export async function compare(plainTextPassword, hashedPassword) {
  return await argon2.verify(hashedPassword, plainTextPassword); // Retourne true si ça correspond, sinon false
}

// Crée un JWT (JSON Web Token) signé avec une clé secrète (JWT_SECRET)
export function generateJwtToken(payload) { // payload = les données dans le token (ex. id, email, role)
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" }); // le token expire au bout d’une journée
}

/*
- On ne stocke jamais un mot de passe en clair dans la base.
- Même si la BDD est piratée, les mots de passe sont inutilisables sans la clé de hachage.
- Quand un utilisateur se connecte, un token JWT est généré. Le front peut le stocker dans localStorage et l'envoyer dans les headers (Authorization: Bearer <token>).
*/

/*
- Argon2 protège les mots de passe.
- JWT gère l’authentification et l’autorisation.
*/