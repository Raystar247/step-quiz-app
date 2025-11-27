import { z } from "zod";

export const postAnswerSchema = z.object({
  body: z.object({
    trialId: z.string().uuid(),
    questionId: z.string().uuid(),
    answer: z.string(),
    score: z.number().optional(),
    memo: z.string().optional()
  })
});

export const answerQuerySchema = z.object({ query: z.object({ trialId: z.string().optional(), qgroupId: z.string().optional(), questionId: z.string().optional() }) });

export const answerUpdateSchema = z.object({ body: z.object({ score: z.number().optional(), scoringStatus: z.string().optional(), memo: z.string().optional() }), params: z.object({ id: z.string().uuid() }) });
