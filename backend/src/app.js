import "dotenv/config";
import express from "express";
import path from "node:path";
import { router } from "../src/routers/index.js";
import { notFound, errorHandler } from "../src/middlewares/errorHandlers.js";
import cors from "cors";
import { xss } from "express-xss-sanitizer";

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(xss());

app.use(cors({origin: process.env.ALLOWED_DOMAINS || "*"}));

// API routes
app.use("/api", router);

// Error handling
app.use(notFound);
app.use(errorHandler);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
export default app;