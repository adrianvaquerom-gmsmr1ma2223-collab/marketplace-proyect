function errorHandler(err, req, res, next) {
  console.error(err);
  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    message: err.message || "Error interno del servidor",
    details: err.details || undefined,
  });
}

module.exports = errorHandler;