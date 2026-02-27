# 🎓 Student Management API 

![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Sistema backend profesional para la gestión de estudiantes (CRUD) construido bajo los principios de **Arquitectura Limpia (Clean Architecture)** y separación de responsabilidades. Incluye una interfaz visual (Dashboard), documentación interactiva, y una suite completa de pruebas automatizadas.

link de pagina vivo : https://sistema-crud-completo-para-students.vercel.app
( se que no pedian hacer lo visual pero queria realizarlo igualmente, dense el gusto de checarlo tambien :D )
---

## 📑 Tabla de Contenidos
1. [Características Principales](#-características-principales)
2. [Arquitectura del Sistema](#-arquitectura-del-sistema)
3. [Estructura del Proyecto](#-estructura-del-proyecto)
4. [Instalación y Despliegue](#-instalación-y-despliegue)
5. [Documentación de la API (Endpoints)](#-documentación-de-la-api)
6. [Suite de Pruebas (Testing)](#-suite-de-pruebas)
7. [Bonus Features Implementados](#-bonus-features-implementados)

---

## ✨ Características Principales

- **RESTful API Estándar:** Respuestas JSON consistentes con códigos de estado HTTP semánticos (200, 201, 204, 400, 404, 409, 500).
- **Validación Robusta:** Filtrado estricto de datos de entrada mediante `express-validator`.
- **Manejo Centralizado de Errores:** Clases de error personalizadas (`NotFoundError`, `ConflictError`, etc.) interceptadas por un middleware global.
- **Paginación y Filtros Avanzados:** Búsqueda full-text, filtrado por tags, grupos y estado activo/inactivo.
- **Seguridad Básica:** Implementación de simuladores de `cors` y `express-rate-limit` para prevenir abusos.
- **Dashboard UI:** Interfaz de usuario moderna en Dark Mode integrada directamente en el servidor estático.

---

## 🏗️ Arquitectura del Sistema

El proyecto sigue un patrón de diseño en capas para garantizar escalabilidad y mantenibilidad:

1. **Router Layer:** Define las rutas HTTP y aplica middlewares de seguridad.
2. **Validation Layer:** Intercepta peticiones para asegurar la integridad de los datos (`express-validator`).
3. **Controller Layer:** Extrae los datos de la petición (req) y formatea la respuesta (res).
4. **Service Layer:** Contiene la **lógica de negocio pura**. Toma decisiones, valida reglas (ej. emails únicos) y coordina.
5. **Data/Repository Layer:** Abstrae la persistencia de datos (actualmente un `Map` en memoria, fácilmente intercambiable por MongoDB o PostgreSQL).

---

## 📂 Estructura del Proyecto

```text
/
├── public/                  # Frontend estático (Dashboard HTML/Tailwind)
├── src/
│   ├── controllers/         # Intermediarios entre la red y los servicios
│   ├── middlewares/         # Interceptores (Autenticación, Rate Limiting)
│   ├── models/              # Entidades y patrón Repository (Base de Datos)
│   ├── routes/              # Mapeo de URLs y métodos HTTP
│   ├── services/            # Lógica de negocio y validación de reglas
│   ├── utils/               # Loggers y clases de Errores Personalizadas
│   ├── validators/          # Esquemas de validación de express-validator
│   ├── app.js               # Configuración central de Express y Swagger
│   └── server.js            # Punto de entrada y configuración del puerto
├── tests/                   # Suite de pruebas automatizadas
│   ├── integration/         # Pruebas de endpoints completos (Supertest)
│   └── unit/                # Pruebas aisladas de lógica de negocio
├── postman_collection.json  # Colección lista para importar y probar
└── package.json             # Dependencias y scripts
```

---

## 🚀 Instalación y Despliegue

### Requisitos Previos
- Node.js (v18 o superior recomendado)
- NPM o Yarn

### Pasos de Instalación
1. Clonar el repositorio y navegar al directorio raíz.
2. Instalar las dependencias de Node:
   ```bash
   npm install
   ```
3. Iniciar el servidor en modo desarrollo (con recarga automática de Nodemon):
   ```bash
   npm run dev
   ```

### Accesos Rápidos
- 💻 **Dashboard Visual:** [http://localhost:3000](http://localhost:3000)
- 📖 **Documentación Swagger:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 📡 Documentación de la API

La API responde bajo el prefijo `/api/v1/students`.

| Método | Endpoint | Funcionalidad | Parámetros Query / Body |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Lista estudiantes paginados | `?page=1&limit=10&search=X&group=Y` |
| **POST** | `/` | Crea un nuevo estudiante | `name`, `email`, `group`, `tags`, `isActive` |
| **GET** | `/stats` | Obtiene métricas globales | N/A |
| **GET** | `/export/csv`| Descarga listado en CSV | N/A |
| **GET** | `/:id` | Obtiene estudiante por ID | Param: `id` |
| **PUT** | `/:id` | Actualiza un estudiante | `name`, `email`, `group`, `tags`, `isActive` |
| **PATCH** | `/bulk` | Actualización masiva | `updates: [{ id, data }]` |
| **DELETE**| `/:id` | Elimina (Soft Delete) | Param: `id` |

*(La documentación detallada de esquemas y códigos de respuesta está disponible interactivamente en la ruta `/api-docs` gracias a Swagger UI).*

---

## 🧪 Suite de Pruebas

El proyecto utiliza **Vitest** como motor de pruebas y **Supertest** para simular peticiones HTTP.

Para ejecutar la suite completa de pruebas unitarias y de integración:
```bash
npm run test
```
*Cobertura: Verifica creación, validación de duplicados, paginación, filtros de búsqueda y eliminación lógica.*

---

## 🏆 Bonus Features Implementados (Criterios "Excelente")

Se han excedido los requerimientos básicos del reto incorporando:

- [x] **Data Seeding con Faker.js:** El repositorio inicia automáticamente con 50 estudiantes aleatorios realistas para facilitar pruebas y paginación.
- [x] **Soft Delete:** La operación `DELETE` no destruye el registro físico, sino que asigna un timestamp a `metadata.deletedAt`, manteniendo la integridad referencial y ocultándolo de las consultas `GET`.
- [x] **Import/Export CSV:** Implementación de la librería `json2csv` para exportar la base de datos completa de estudiantes a una hoja de cálculo desde un endpoint dedicado.
- [x] **Advanced Search:** Algoritmo de búsqueda insensible a mayúsculas que escanea simultáneamente por Nombre, Email, Grupo y Etiquetas.
- [x] **Frontend Integrado:** Un panel de control 100% funcional servido estáticamente que consume la API en tiempo real.
