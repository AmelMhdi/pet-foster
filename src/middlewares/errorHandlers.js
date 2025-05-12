const notFound = (req, res, next) => {
  const error = new Error("Not Found");
  error.statusCode = 404;
  next(error);
};

// Le but de ce Middleware est d'uniformiser les retour d'erreur, peut importe d'où ils proviennent dans mon application (dans mes APIs)
// Il faudra juste faire en sorte que le paramètre error de ce Middleware contienne les infos dont le Middleware a besoin :
//   - Un "statusCode" avec le code HTTP de l'erreur
//   - Un "message" avec le ou les messages d'erreurs à indiquer au client de notre API pour l'informer du problème qu'il a rencontré.
const errorHandler = (error, req, res, next) => {
  const status = error.statusCode || 500;

  // Ici, on pourrait potentiellement obfusquer le message d'erreur si il contient des données sensibles.

  // Là on est sur de l'API, donc on retourne du JSON, mais si on avait été sur une app frontale ou monorepo, on aurait pu faire un render ejs
  // d'une jolie page d'erreur customisée.
  // Afin de forcer pour que la clé "error" soit toujours du même format, on force un tableau
  // (car le tableau est le format qu'on a utilisé pour les messages d'erreur avec Joi).
  // L'intérêt d'avoir toujours le même format d'erreur, c'est de faciliter la gestion des erreurs pour le client de notre API,
  // en faisant en sorte qu'il n'y ait pas de différence selon l'erreur relevée.
  res.status(status).json({
    status,
    error: Array.isArray(error.message) ? error.message : [error.message],
  });
};

export { notFound, errorHandler };
