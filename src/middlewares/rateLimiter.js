// src/middlewares/rateLimiter.js
export const rateLimiter = (options) => {
  return (req, res, next) => {
    // Aquí iría la librería express-rate-limit. Simulamos que pasa.
    next();
  };
};