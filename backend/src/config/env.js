import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['MONGODB_URI', 'OPENWEATHER_API_KEY'];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI,
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
  openWeatherBaseUrl:
    process.env.OPENWEATHER_BASE_URL ||
    'https://api.openweathermap.org/data/2.5',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
