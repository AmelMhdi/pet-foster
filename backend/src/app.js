import "dotenv/config";
import express from "express";
import path from "path";
import { router } from "./routers/index.js";
import { notFound, errorHandler } from "./middlewares/errorHandlers.js";
import cors from "cors";
import { xss } from "express-xss-sanitizer";
import compression from "compression";

export const app = express();

app.use(express.json());

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(compression());

app.use(xss());

console.log("Environment check:");
console.log("ALLOWED_DOMAINS:", process.env.ALLOWED_DOMAINS);
console.log("PORT:", process.env.PORT);

const allowedOrigins = process.env.ALLOWED_DOMAINS 
  ? process.env.ALLOWED_DOMAINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173']; // fallback par défaut

console.log("Parsed allowed origins:", allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    console.log("Request from origin:", origin);
    console.log("Allowed origins:", allowedOrigins);
    
    // Permettre les requêtes sans origin (Postman, apps mobiles, etc.)
    if (!origin) return callback(null, true);
    
    // Vérifier si l'origin est dans la liste autorisée
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log("Origin not allowed:", origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Important pour les cookies/sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Route accueil
app.get("/", (req, res) => {
  res.send("🚀 Backend Pet Foster Connect en ligne !");
});

// Routes API
app.use("/api", router);

// Middleware 404
app.use(notFound);

// Middleware erreur
app.use(errorHandler);