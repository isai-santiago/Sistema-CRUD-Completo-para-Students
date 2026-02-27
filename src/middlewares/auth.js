// src/middlewares/auth.js
export const authenticateToken = (req, res, next) => {
  // Simulamos que cualquier petición con el header Authorization pasa
  const authHeader = req.headers['authorization'];
  if (authHeader) return next();
  // En testing, dejaremos pasar todo para simplificar, pero en prod lanzarías un 401
  next(); 
};