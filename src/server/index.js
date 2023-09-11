import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { PORT } from './config.js';
import router from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, './client/build')));

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Express app listening at http://localhost:${PORT}`);
});

export { app };
