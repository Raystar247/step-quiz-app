import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = schema.parse({ body: req.body, query: req.query, params: req.params });
    // merge parsed body back into req for convenience (avoid reassigning read-only props)
    req.body = parsed.body ?? req.body;
    return next();
  } catch (err: any) {
    const e: any = new Error("Validation failed");
    e.statusCode = 400;
    e.code = "VALIDATION_ERROR";
    e.details = err.errors ?? err;
    return next(e);
  }
};
