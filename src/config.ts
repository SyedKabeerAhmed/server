import 'dotenv/config';

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? 'secret',
  freeCurrencyApiKey: process.env.FREECURRENCYAPI_KEY ?? '',
  mongoUri: process.env.MONGO_URI || process.env.MONGODB_URI || '',
  corsOrigin: process.env.CORS_ORIGIN ?? 'https://client-bqkj.vercel.app',
};
