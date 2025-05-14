import "dotenv/config";
import express from "express";
import path from "node:path";
import { router } from "./routers/index.js";
import { notFound, errorHandler } from "./middlewares/errorHandlers.js";
import cors from "cors";
import { xss } from "express-xss-sanitizer";

// Création de l'app Express
export const app = express();

app.use(
  express.static(
    path.resolve(import.meta.dirname, "../pet-foster-connect/dist")
  )
);

app.use(express.json());

app.use(xss());

app.use(
  cors({
    origin: process.env.ALLOWED_DOMAINS,
  })
);

app.use("/api", router);

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(
    path.resolve(import.meta.dirname, "../pet-foster-connect/dist/index.html")
  );
});

app.use(notFound);

app.use(errorHandler);
