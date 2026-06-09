import cors from 'cors';
import express from 'express';
import { config } from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { taskRouter } from './routes/task.routes.js';

config();

const allowedOrigin = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';

export const app = express();

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'aurora-task-manager-api' });
});

app.use('/api/tasks', taskRouter);
app.use(notFound);
app.use(errorHandler);
