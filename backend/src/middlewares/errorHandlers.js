// middleware de gestion des erreurs 404 et 500

// Si aucune route ne correspond à la requête, Express exécute ce middleware
// Il crée une erreur personnalisée avec le message "Not Found" et un code 404
// puis la transmet au middleware de gestion des erreurs suivant (errorHandler)
// Si je vais sur /api/chien mais que la route n’existe pas, notFound va générer une erreur 404
const notFound = (req, res, next) => {
  const error = new Error("Not Found");
  error.statusCode = 404;
  next(error);
};

// Centralise la gestion des erreurs
// Récupère l’objet error envoyé par next(error)
const errorHandler = (error, req, res, next) => {
  console.error("Error caught in middleware:", error); // log l'erreur pour le débogage

  // Détermine le code HTTP à renvoyer :
  // error.statusCode si défini (ex. 400, 401, 404)
  // Sinon 500 (erreur interne serveur)
  const status = error.statusCode || error.status || 500;
  res.status(status).json({
    status,
    error: Array.isArray(error.message) ? error.message : [error.message],
  }); // le message est mis dans un tableau 
};

export { notFound, errorHandler };

/*
- notFound attrape les routes inconnues et crée une erreur 404
- errorHandler attrape toutes les erreurs et envoie une réponse JSON claire et standardisée au client
*/