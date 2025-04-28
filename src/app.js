import "dotenv/config";
import express from "express";
import { router } from "./routers/index.js";

// Création de l'app Express
export const app = express();

app.use(express.json());

// Brancher le routeur avec le préfixe /api
app.use("/api", router);