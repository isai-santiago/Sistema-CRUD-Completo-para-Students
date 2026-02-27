import { faker } from '@faker-js/faker';

export class Student {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.name = data.name;
    this.email = data.email;
    this.group = data.group;
    this.enrollmentDate = data.enrollmentDate || new Date();
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.tags = data.tags || [];
    this.notes = data.notes || "";
    this.metadata = {
      createdAt: data.metadata?.createdAt || new Date(),
      updatedAt: new Date(),
      createdBy: data.metadata?.createdBy,
      // 👇 Aquí está el Soft Delete
      deletedAt: data.metadata?.deletedAt || null, 
    };
  }

  generateId() {
    return `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  update(data) {
    const allowedFields = ["name", "email", "group", "isActive", "tags", "notes"];
    allowedFields.forEach((field) => {
      if (data[field] !== undefined) this[field] = data[field];
    });
    this.metadata.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id, name: this.name, email: this.email,
      group: this.group, isActive: this.isActive, 
      tags: this.tags, metadata: this.metadata,
    };
  }
}

export class StudentRepository {
  constructor() {
    this.students = new Map();
    this.initializeTestData(); // Llama a Faker
  }

  initializeTestData() {
    // 👇 Bonus: Data Seeding con Faker.js
    for (let i = 0; i < 50; i++) {
      const student = new Student({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        group: faker.helpers.arrayElement(["Frontend-2024", "Backend-2024", "DevOps-2024"]),
        isActive: faker.datatype.boolean(),
        tags: [faker.word.sample(), faker.word.sample()],
      });
      this.students.set(student.id, student);
    }
  }

  async findAll(filters = {}) {
    // 👇 Solo traemos a los que NO están eliminados (Soft Delete)
    let activeStudents = Array.from(this.students.values()).filter(s => s.metadata.deletedAt === null);

    if (filters.search) {
      const search = filters.search.toLowerCase();
      activeStudents = activeStudents.filter(s => 
        s.name.toLowerCase().includes(search) || s.email.toLowerCase().includes(search)
      );
    }
    
    // Ordenamiento por defecto
    activeStudents.sort((a, b) => a.name.localeCompare(b.name));
    return activeStudents;
  }

  async findById(id) { 
    const student = this.students.get(id);
    return (student && student.metadata.deletedAt === null) ? student : null;
  }
  
  async findByEmail(email) {
    return Array.from(this.students.values()).find(
      s => s.email.toLowerCase() === email.toLowerCase() && s.metadata.deletedAt === null
    ) || null;
  }

  async create(studentData) {
    const student = new Student(studentData);
    this.students.set(student.id, student);
    return student;
  }

  async update(id, updateData) {
    const student = await this.findById(id);
    if (!student) return null;
    student.update(updateData);
    this.students.set(id, student);
    return student;
  }

  async delete(id) {
    const student = this.students.get(id);
    if (!student || student.metadata.deletedAt !== null) return false;
    
    // 👇 Aplicamos el Soft Delete (solo le ponemos fecha, no lo borramos)
    student.metadata.deletedAt = new Date();
    this.students.set(id, student);
    return true;
  }

  async count(filters = {}) {
    const students = await this.findAll(filters);
    return students.length;
  }
}