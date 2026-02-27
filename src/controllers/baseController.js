export class BaseController {
  // Atrapa errores asíncronos y los pasa al middleware global de errores
  asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  sendSuccess(res, data, message = 'Success', statusCode = 200) {
    res.status(statusCode).json({ success: true, message, data });
  }

  sendPaginated(res, data, pagination, message = 'Success') {
    res.status(200).json({ success: true, message, data, pagination });
  }

  sendError(res, message, statusCode = 500, code = 'INTERNAL_ERROR') {
    res.status(statusCode).json({ success: false, code, error: message });
  }
}