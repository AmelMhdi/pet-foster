// src/middlewares/validateId.js
export function validateId(req, res, next) {
  const idParam = req.params.id;

  if (!/^\d+$/.test(idParam)) {
    return res.status(400).json({
      error: "Paramètre 'id' invalide",
    });
  }

  next();
}
