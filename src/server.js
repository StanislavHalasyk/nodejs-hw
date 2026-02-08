import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';

import notesRouter from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

// ===== Middleware =====
app.use(logger);

app.use(
  express.json({
    type: ['application/json'],
    limit: '100kb',
  }),
);

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(authRoutes);

app.use(notesRouter);

app.use(userRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is working ',
    endpoints: {
      register: 'POST /auth/register',
      login: 'POST /auth/login',
      logout: 'POST /auth/logout',
      refresh: 'POST /auth/refresh',
      notes: 'GET /notes',
    },
  });
});

// ===== Errors =====
app.use(errors());
app.use(notFoundHandler);
app.use(errorHandler);

// ===== DB + Server =====
await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
