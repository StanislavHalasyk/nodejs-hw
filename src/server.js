import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'dotenv/config';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import notesRouter from './routes/notesRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Middleware
app.use(logger);
app.use(
  express.json({
    type: ['application/json'],
    limit: '100kb',
  }),
);
app.use(cors());

// Routes
app.use('/notes', notesRouter);

// 404 handler
app.use(notFoundHandler);

// Celebrate validation errors
app.use(errors());

// Custom error handler
app.use(errorHandler);

// DB + Server
await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
