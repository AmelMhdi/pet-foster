import { app } from "./src/app.js"; // app vient du fichier app.js.
// app est une application Express configurée (middlewares, routes, gestion des erreurs)

// démarrage du serveur sur le port défini dans les variables d'environnement ou 3001 par défaut
const PORT = process.env.PORT || 3001;
// app.listen(...) lance le serveur avec Express
// '0.0.0.0' signifie que le serveur écoute toutes les adresses réseau (utile pour tester depuis un téléphone sur le même wifi)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`); // log dans la console que le serveur est démarré
});

/*
  Point d’entrée du backend : le fichier qui démarre le serveur
 */