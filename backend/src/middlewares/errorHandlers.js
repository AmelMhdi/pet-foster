const notFound = (req, res, next) => {
  const error = new Error("Not Found");
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, req, res, next) => {
  console.error("Error caught in middleware:", error);

  const status = error.statusCode || error.status || 500;
  res.status(status).json({
    status,
    error: Array.isArray(error.message) ? error.message : [error.message],
  });
};

export { notFound, errorHandler };