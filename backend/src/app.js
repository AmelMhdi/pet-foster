import "dotenv/config"; // Charger les variables d'environnement dès le début
import express from "express"; // framework web pour créer serveur HTTP
import path from "path"; // module natif pour gérer les chemins de fichiers
import { router } from "./routers/index.js"; // importation des routes de l'API
import { notFound, errorHandler } from "./middlewares/errorHandlers.js"; // gestion des erreurs
import cors from "cors"; // pour gérer la sécurité des requêtes cross-domain
import { xss } from "express-xss-sanitizer"; // pour protéger contre les attaques XSS
import compression from "compression"; // pour compresser les réponses HTTP

// instancier l'application Express et l'exporter
// est utilisée pour lancer le serveur
export const app = express();

// recevoir req.body en JSON
app.use(express.json()); // pour parser le JSON envoyé dans le corps des requêtes

// gestion des fichiers statiques
// expose 2 dossiers "public/uploads" et "public/images" accessibles depuis URL
// ex : une image stockée en local dans /public/images/chat.png sera accessible à http://localhost:3000/images/chat.png
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(compression()); // compresse les réponses HTTP pour réduire la taille des données transférées

app.use(xss()); // protège contre les attaques XSS en nettoyant les entrées utilisateur

// vérification et configuration de CORS
console.log("Environment check:");
console.log("ALLOWED_DOMAINS:", process.env.ALLOWED_DOMAINS);
console.log("PORT:", process.env.PORT);

// on lit la variable d'env ALLOWED_DOMAINS pour savoir quels frontends ont le droit d’appeler l’API.
// si non définie, on autorise localhost:5173 (dev frontend)
const allowedOrigins = process.env.ALLOWED_DOMAINS 
  ? process.env.ALLOWED_DOMAINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173']; // fallback par défaut

console.log("Parsed allowed origins:", allowedOrigins);

/* Middleware CORS personnalisé
  - but : autoriser que certains domaines à accéder à l'API
  - credentials: true permet d'envoyer les cookies/sessions
  - vérifie l'origine de la requête entrante (origin) et la compare à la liste allowedOrigins
  - si l'origine est dans la liste, la requête est autorisée
  sinon, une erreur CORS est renvoyée
*/
app.use(cors({
  origin: function (origin, callback) {
    console.log("Requête depuis l'origine :", origin);
    console.log("Origines autorisées :", allowedOrigins);

    // Permettre les requêtes sans origin (Postman, apps mobiles, etc.)
    if (!origin) return callback(null, true);
    
    // Vérifier si l'origin est dans la liste autorisée
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // En dev → on peut être un peu plus permissif
    if (process.env.NODE_ENV === "development") {
      console.warn(`⚠️ Origin ${origin} non listé, mais autorisé en dev`);
      return callback(null, true);
    }
    
    return callback(new Error("Non autorisé par CORS"));
  },
  credentials: true, // Important pour les cookies/sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Route accueil pour tester que le serveur fonctionne
app.get("/", (req, res) => {
  res.send("🚀 Backend Pet Foster Connect en ligne !");
});

// Routes API principales
// tout ce qui commence par /api est géré par le router
app.use("/api", router);

// Middleware 404, si aucune route ne correspond
app.use(notFound);

// Middleware erreur, capture toutes les erreurs serveur et renvoie une réponse
app.use(errorHandler);

/** Ce fichier met en place :
  - un serveur Express propre et structuré,
  - la gestion de la sécurité (XSS, CORS, JSON),
  - l’accès aux fichiers publics,
  - l’optimisation des réponses (compression),
  - les routes API et la gestion centralisée des erreurs.
 */