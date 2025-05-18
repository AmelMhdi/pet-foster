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

app.use(express.static(path.resolve(__dirname, "../pet-foster-connect/dist")));

app.use('/images', express.static(path.resolve(__dirname, '../pet-foster-connect/public/images')));

app.use(express.json());

app.use(xss());

app.use(cors({origin: process.env.ALLOWED_DOMAINS,}));

app.use("/api", router);

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "../pet-foster-connect/dist/index.html")
  );
});

app.use(notFound);

app.use(errorHandler);