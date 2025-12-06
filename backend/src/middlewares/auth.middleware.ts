import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/default";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) {
    console.log("Missing Authorization header");
    return res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Missing Authorization header" } });
  }
  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    console.log("Invalid Authorization header");
    return res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Invalid Authorization header" } });
  }
  const token = parts[1];
  try {
    const payload: any = jwt.verify(token, config.jwtSecret);
    (req as any).user = { userId: payload.userId };
    next();
  } catch (err) {
    console.log("Invalid token");
    return res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Invalid token" } });
  }
};
