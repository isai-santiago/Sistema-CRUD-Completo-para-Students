import express from "express";
import { StudentController } from "../../../controllers/studentController.js";
import {
  createStudentValidation,
  updateStudentValidation,
  studentIdValidation,
  listStudentsValidation,
  handleValidationErrors,
} from "../../../validators/studentValidator.js";
import { authenticateToken } from "../../../middlewares/auth.js";
import { rateLimiter } from "../../../middlewares/rateLimiter.js";

const router = express.Router();
const studentController = new StudentController();

// Aplica middlewares de seguridad a todas las rutas
router.use(authenticateToken);
router.use(rateLimiter());

// Rutas
router.get("/", listStudentsValidation, handleValidationErrors, studentController.getAllStudents);
router.get("/stats", studentController.getStudentStats); // ¡Debe ir antes de /:id para no confundir 'stats' con un ID!
router.get("/export/csv", studentController.exportCSV);
router.get("/:id", studentIdValidation, handleValidationErrors, studentController.getStudentById);
router.post("/", createStudentValidation, handleValidationErrors, studentController.createStudent);
router.put("/:id", studentIdValidation, updateStudentValidation, handleValidationErrors, studentController.updateStudent);
router.delete("/:id", studentIdValidation, handleValidationErrors, studentController.deleteStudent);

export default router;