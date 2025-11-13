// middleware de gestion des erreurs 404 et 500

// Si aucune route ne correspond à la requête, Express exécute ce middleware
// Il crée une erreur personnalisée avec le message "Not Found" et un code 404
// puis la transmet au middleware de gestion des erreurs suivant (errorHandler)
// Si je vais sur /api/chien mais que la route n’existe pas, notFound va générer une erreur 404
const notFound = (req, res, next) => {
  console.warn(`Route non trouvée : ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "Route non trouvée" });
};

// Centralise la gestion des erreurs
// Récupère l’objet error envoyé par next(error)
const errorHandler = (error, req, res, next) => {
  console.error("💥 Erreur attrapée par errorHandler :", error); // log l'erreur pour le débogage

  // Détermine le code HTTP à renvoyer :
  // error.statusCode si défini (ex. 400, 401, 404)
  // Sinon 500 (erreur interne serveur)
  res.status(error.statusCode || 500).json({
    message: error.message || "Erreur interne du serveur",
  }); // le message est mis dans un tableau 
};

export { notFound, errorHandler };

/*
- notFound attrape les routes inconnues et crée une erreur 404
- errorHandler attrape toutes les erreurs et envoie une réponse JSON claire et standardisée au client
*/