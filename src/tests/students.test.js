import { describe, it, expect, beforeEach } from "vitest";
import { StudentService } from "../../services/studentService.js";

describe("StudentService Unit Tests", () => {
  let service;

  beforeEach(() => {
    service = new StudentService();
  });

  it("Debería retornar estadísticas iniciales correctas", async () => {
    const stats = await service.getStudentStats();
    expect(stats).toHaveProperty("total");
    expect(stats.total).toBeGreaterThanOrEqual(50); // Por los 50 de Faker
  });

  it("Debería lanzar error al crear un usuario con email duplicado", async () => {
    // 1. Creamos el primero
    await service.createStudent({ name: "Test 1", email: "duplicado@test.com", group: "A" });
    
    // 2. Intentamos crear otro con el mismo correo y esperamos que explote
    await expect(
      service.createStudent({ name: "Test 2", email: "duplicado@test.com", group: "B" })
    ).rejects.toThrow(/already exists/);
  });
});