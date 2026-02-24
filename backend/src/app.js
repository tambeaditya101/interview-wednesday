import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import weatherRoutes from './routes/weather.routes.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
  });
});

app.use('/api/v1/weather', weatherRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
