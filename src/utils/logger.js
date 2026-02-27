export const Logger = {
  info: (msg, meta = {}) => console.log(`[INFO] ${msg}`, meta),
  error: (msg, err, meta = {}) => console.error(`[ERROR] ${msg}`, err.message, meta),
  warn: (msg, meta = {}) => console.warn(`[WARN] ${msg}`, meta)
};