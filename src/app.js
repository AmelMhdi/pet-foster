import "dotenv/config";

import express from "express";
import  {router} from "./routers/index.js";

// Création de l'app Express
export const app = express();


// Pour pouvoir utiliser le req.body et récupérer le JSON envoyé par le client
app.use(express.json());

// Brancher le routeur
app.use( router );
