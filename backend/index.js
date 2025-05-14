import { createServer } from 'node:http';
import { app } from "./src/app.js";

// Création d'un serveur node:http
const server = createServer(app);

// Démarrer le serveur
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`🚀 Server listening at http://localhost:${port}`);
});