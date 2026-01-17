import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const PORT = process.env.PORT ?? 3000;

app.use(logger);
app.use(
  express.json({
    type: ['application/json'],
    limit: '100kb',
  }),
);
app.use(cors());

app.use(notesRouter);

app.use(notFoundHandler);
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
