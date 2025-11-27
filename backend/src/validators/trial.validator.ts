import { z } from "zod";

export const trialCreateSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    passphrase: z.string().min(1),
    userId: z.string().uuid()
  })
});

export const trialQuerySchema = z.object({ query: z.object({ id: z.string().optional(), qgroupId: z.string().optional(), userId: z.string().optional() }) });
