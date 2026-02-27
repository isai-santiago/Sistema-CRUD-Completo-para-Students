import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import studentRoutes from './routes/api/v1/students.js';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// --- CONFIGURACIÓN VISUAL (SWAGGER) ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Estudiantes (Student CRUD)',
      version: '1.0.0',
      description: 'Sistema completo de gestión de estudiantes con operaciones CRUD.',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Servidor Local' }
    ],
  },
  // Aquí le decimos que lea los comentarios mágicos de tu archivo de rutas
  apis: ['./src/routes/api/v1/*.js'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
// Creamos la ruta visual
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// --------------------------------------

// Montar las rutas de la API
app.use('/api/v1/students', studentRoutes);

// Manejador de rutas no encontradas (404 global)
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    code: err.code || 'SERVER_ERROR',
    ...(err.details && { details: err.details })
  });
});

export default app;