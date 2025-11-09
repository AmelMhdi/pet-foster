import jwt from "jsonwebtoken"; // librairie jsonwebtoken pour vérifier les tokens JWT envoyés par le client

// isAuth est une fonction middleware : elle s’intercale entre la requête HTTP et la route
// Elle sert à vérifier si l’utilisateur est authentifié avant d’autoriser l’accès à la ressource
export function isAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("🔐 Header reçu :", req.headers.authorization);

  // Les tokens JWT sont envoyés dans l’en-tête HTTP : Authorization: Bearer <token>
  // Si l’en-tête est manquant ou mal formé, on renvoie une erreur 401 Unauthorized
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Token manquant ou mal formé" });
  }

  const token = authHeader.split(" ")[1]; // on découpe la chaîne "Bearer <token>" et on récupère uniquement la partie <token>

  // vérification et décodage du token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // vérifie la signature du token avec la clé secrète (JWT_SECRET)
    console.log("✅ Token valide, utilisateur :", decoded);
    req.user = decoded; // Si validé, le contenu du token (payload, ex. { id: 12, role: "admin" }) est stocké dans req.user
    next(); // on appelle next() pour passer au middleware ou à la route suivante
  } catch (err) {
    console.error("❌ Token invalide :", err.message);
    res.status(401).json({ message: "Token invalide" }); // Si le token est invalide ou expiré, on renvoie une erreur 401 Unauthorized
  }
}

/*
Le middleware isAuth permet de sécuriser les routes privées.
- Vérifie que le token JWT est présent et bien formé
- Vérifie que le token est valide (signature + expiration)
- Attache les infos de l’utilisateur (req.user) à la requête
- Sinon, rejette avec une erreur 401 Unauthorized
*/

// Exemple d’utilisation dans une route Express
// import { isAuth } from "./middlewares/authentification.js";

// app.get("/api/profile", isAuth, (req, res) => {
//   res.json({ message: `Bonjour ${req.user.email}` });
// });