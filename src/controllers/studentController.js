import { StudentService } from "../services/studentService.js";
import { BaseController } from "./baseController.js";
import { Parser } from 'json2csv';

export class StudentController extends BaseController {
  constructor() {
    super();
    this.studentService = new StudentService();
  }

  getAllStudents = this.asyncHandler(async (req, res) => {
    const options = {
      page: req.query.page, limit: req.query.limit, search: req.query.search,
      group: req.query.group, sortBy: req.query.sortBy, sortOrder: req.query.sortOrder
    };
    const result = await this.studentService.getAllStudents(options);
    this.sendPaginated(res, result.data, result.pagination, "Students retrieved successfully");
  });

  getStudentById = this.asyncHandler(async (req, res) => {
    const student = await this.studentService.getStudentById(req.params.id);
    this.sendSuccess(res, student, "Student retrieved successfully");
  });

  createStudent = this.asyncHandler(async (req, res) => {
    const newStudent = await this.studentService.createStudent(req.body);
    this.sendSuccess(res, newStudent, "Student created successfully", 201);
  });

  updateStudent = this.asyncHandler(async (req, res) => {
    const updatedStudent = await this.studentService.updateStudent(req.params.id, req.body);
    this.sendSuccess(res, updatedStudent, "Student updated successfully");
  });

  deleteStudent = this.asyncHandler(async (req, res) => {
    await this.studentService.deleteStudent(req.params.id);
    this.sendSuccess(res, null, "Student deleted successfully", 204);
  });

  getStudentStats = this.asyncHandler(async (req, res) => {
    const stats = await this.studentService.getStudentStats();
    this.sendSuccess(res, stats, "Student statistics retrieved successfully");
  });
  // GET /api/v1/students/export/csv
exportCSV = this.asyncHandler(async (req, res) => {
  // Obtenemos todos los estudiantes (sin límite)
  const result = await this.studentService.getAllStudents({ limit: 1000 });

  if (result.data.length === 0) {
    return this.sendError(res, "No hay estudiantes para exportar", 404);
  }

  // Convertimos el JSON a formato CSV
  const fields = ['id', 'name', 'email', 'group', 'isActive'];
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(result.data);

  // Enviamos el archivo como descarga
  res.header('Content-Type', 'text/csv');
  res.attachment('estudiantes_exportados.csv');
  res.send(csv);
});
}