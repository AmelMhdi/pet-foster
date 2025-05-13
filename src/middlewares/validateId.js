export function validateId(req, res, next) {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    const err = new Error("Paramètre 'id' invalide");
    err.status = 400;
    return next(err);
  }
  next();
}
