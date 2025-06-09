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

const allowedOrigins = process.env.ALLOWED_DOMAINS.split(',').map(origin => origin.trim());

app.use(cors({
  origin: function (origin, callback) {
    console.log("Request from origin:", origin);
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  }
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