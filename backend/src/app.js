import "dotenv/config";
import express from "express";
import path from "node:path";
import { router } from "./routers/index.js";
import { notFound, errorHandler } from "./middlewares/errorHandlers.js";
import cors from "cors";
import { xss } from "express-xss-sanitizer";
import compression from "compression";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.use(compression());

app.use(express.json());

app.use(xss());

const allowedOrigins = process.env.ALLOWED_DOMAINS.split(',');

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

app.use("/api", router);

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "../../frontend/dist/index.html")
  );
});

app.use(notFound);

app.use(errorHandler);