import { body, param, query, validationResult } from "express-validator";

const nameValidation = body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters");
const emailValidation = body("email").trim().isEmail().normalizeEmail().withMessage("Must be a valid email address");
const groupValidation = body("group").trim().isLength({ min: 1, max: 50 }).withMessage("Group must be between 1 and 50 characters");
const isActiveValidation = body("isActive").optional().isBoolean().withMessage("isActive must be a boolean value");
const tagsValidation = body("tags").optional().isArray({ max: 10 }).withMessage("Tags must be an array with maximum 10 items");
const notesValidation = body("notes").optional().trim().isLength({ max: 500 }).withMessage("Notes must not exceed 500 characters");

export const createStudentValidation = [
  nameValidation, emailValidation, groupValidation, isActiveValidation, tagsValidation, notesValidation
];

export const updateStudentValidation = [
  nameValidation.optional(),
  body("email").optional().trim().isEmail().normalizeEmail(),
  groupValidation.optional(), isActiveValidation, tagsValidation, notesValidation
];

export const studentIdValidation = [
  param("id").trim().notEmpty().withMessage("Student ID is required")
];

export const listStudentsValidation = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 })
];

// Middleware para atrapar los errores
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      code: "VALIDATION_ERROR",
      details: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};