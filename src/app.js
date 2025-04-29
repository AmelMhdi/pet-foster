import "dotenv/config";
import express from "express";
<
import { router } from "./routers/index.js";
import { notFound, errorHandler } from "./middlewares/errorHandlers.js";
import cors from "cors";
import { xss } from "express-xss-sanitizer";

// Création de l'app Express
export const app = express();


app.use(xss());

app.use(
  cors({
    // On définit certains noms de domaines qu'on veut autoriser (certaines origines de notre appel)
    origin: (origin, callback) => {
      // Autoriser toutes les origines "localhost" ou "127.0.0.1", peu importe le port
      if (
        !origin ||
          /^(http:\/\/localhost:\d+|http:\/\/127\.0\.0\.1:\d+)$/.test(
            origin
          )
      ) {
        callback(null, true); // Autoriser l'origine
      } else {
        callback(new Error("Not allowed by CORS")); // Bloquer l'origine
      }
    },
  })
);

// Brancher le routeur
app.use("/api", router);



app.use(notFound);

app.use(errorHandler);
