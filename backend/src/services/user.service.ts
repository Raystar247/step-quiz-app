import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/default";
import * as userRepo from "../repositories/user.repository";

export const createUser = async (dto: { email: string; password: string; name: string }) => {
  const existing = await userRepo.findByEmail(dto.email);
  if (existing) {
    const err: any = new Error("Email already exists");
    err.statusCode = 409;
    err.code = "CONFLICT";
    throw err;
  }
  const hash = await bcrypt.hash(dto.password, 10);
  const created = await userRepo.create({ email: dto.email, passwordHash: hash, name: dto.name });
  return { id: created.id, email: created.email, name: created.name };
};

export const authenticateUser = async (dto: { email: string; password: string }) => {
  const user = await userRepo.findByEmail(dto.email);
  if (!user) {
    const err: any = new Error("Invalid credentials");
    err.statusCode = 401;
    err.code = "UNAUTHORIZED";
    throw err;
  }
  const ok = await bcrypt.compare(dto.password, user.passwordHash);
  if (!ok) {
    const err: any = new Error("Invalid credentials");
    err.statusCode = 401;
    err.code = "UNAUTHORIZED";
    throw err;
  }
  const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: "7d" });
  return { token, user: { id: user.id, email: user.email, name: user.name } };
};

export const getUserById = async (id: string) => {
  const user = await userRepo.findById(id);
  if (!user) {
    const err: any = new Error("User not found");
    err.statusCode = 404;
    err.code = "NOT_FOUND";
    throw err;
  }
  return { id: user.id, email: user.email, name: user.name };
};
