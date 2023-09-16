import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { PORT } from './src/config.js';
import router from './src/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, './client/build')));

app.use('/', router);

app.listen(PORT, '0.0.0.0', () => {
    console.log('Server is running on http://0.0.0.0:8888');
  });

export { app };