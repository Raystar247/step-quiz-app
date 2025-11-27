import dotenv from "dotenv";
dotenv.config();

export default {
  jwtSecret: process.env.JWT_SECRET ?? "please-set-a-secret",
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL ?? "file:./dev.db",
  // Comma-separated list of allowed origins for production, e.g. "https://example.com,https://app.example.com"
  corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : undefined,
  nodeEnv: process.env.NODE_ENV ?? 'development'
};
