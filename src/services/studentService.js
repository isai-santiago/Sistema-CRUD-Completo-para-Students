import { StudentRepository } from "../models/Student.js";
import { Logger } from "../utils/logger.js";
import { NotFoundError, ConflictError } from "../utils/errors.js";

export class StudentService {
  constructor() {
    this.repository = new StudentRepository();
  }

  async getAllStudents(options = {}) {
    const { page = 1, limit = 10, search, group, isActive, tags, sortBy = "name", sortOrder = "asc" } = options;
    
    let parsedTags = tags;
    if (typeof tags === "string") parsedTags = tags.split(",").map(t => t.trim()).filter(Boolean);

    const filters = { search, group, isActive, tags: parsedTags, sortBy, sortOrder };
    const total = await this.repository.count(filters);
    const allStudents = await this.repository.findAll(filters);

    const startIndex = (page - 1) * limit;
    const paginatedStudents = allStudents.slice(startIndex, startIndex + limit);

    Logger.info("Retrieved students", { total, page });

    return {
      data: paginatedStudents.map(s => s.toJSON()),
      pagination: {
        page: parseInt(page), limit: parseInt(limit), total,
        pages: Math.ceil(total / limit),
        hasNext: (startIndex + limit) < total, hasPrev: page > 1
      }
    };
  }

  async getStudentById(id) {
    const student = await this.repository.findById(id);
    if (!student) throw new NotFoundError(`Student with ID ${id} not found`);
    return student.toJSON();
  }

  async createStudent(studentData) {
    const existingStudent = await this.repository.findByEmail(studentData.email);
    if (existingStudent) throw new ConflictError(`Student with email ${studentData.email} already exists`);
    
    const student = await this.repository.create(studentData);
    Logger.info(`Created student: ${student.name}`);
    return student.toJSON();
  }

  async updateStudent(id, updateData) {
    const existingStudent = await this.repository.findById(id);
    if (!existingStudent) throw new NotFoundError(`Student with ID ${id} not found`);

    if (updateData.email && updateData.email !== existingStudent.email) {
      const duplicate = await this.repository.findByEmail(updateData.email);
      if (duplicate) throw new ConflictError(`Email ${updateData.email} is taken`);
    }

    const updatedStudent = await this.repository.update(id, updateData);
    Logger.info(`Updated student: ${updatedStudent.id}`);
    return updatedStudent.toJSON();
  }

  async deleteStudent(id) {
    const student = await this.repository.findById(id);
    if (!student) throw new NotFoundError(`Student with ID ${id} not found`);
    
    await this.repository.delete(id);
    Logger.info(`Deleted student: ${id}`);
    return true;
  }

  async getStudentStats() {
    const allStudents = await this.repository.findAll();
    return {
      total: allStudents.length,
      active: allStudents.filter(s => s.isActive).length,
      inactive: allStudents.filter(s => !s.isActive).length
    };
  }
}