import { z } from "zod";

export const signUpSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    username: z.string().min(1)
  })
});

export const signInSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })
});
