import dotenv from "dotenv";
dotenv.config();

export default {
  jwtSecret: process.env.JWT_SECRET ?? "please-set-a-secret",
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL ?? "file:./dev.db"
};
