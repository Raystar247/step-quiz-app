import { z } from "zod";

export const questionSearchSchema = z.object({
  query: z.object({
    qgroupId: z.string().uuid(),
    index: z.string().optional()
  })
});

export const questionIdSchema = z.object({ params: z.object({ id: z.string().uuid() }) });

export const questionCreateSchema = z.object({
  body: z.object({
    qgroupId: z.string().uuid(),
    index: z.number().int(),
    description: z.string().min(1),
    correctAnswer: z.string().min(1)
  })
});
