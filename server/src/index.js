import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { PORT } from './config.js';
import router from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use('/', router);

app.listen(PORT, '0.0.0.0', () => {
    console.log('Server is running on http://0.0.0.0:8888');
  });

export { app };