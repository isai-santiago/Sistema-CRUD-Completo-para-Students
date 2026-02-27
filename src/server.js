import app from './app.js';
import { Logger } from './utils/logger.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  Logger.info(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});