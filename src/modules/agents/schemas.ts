import { z } from "zod";

// schemas.ts
export const agentsInsertSchema = z.object({
  name: z.string(),
  subject: z.enum([
    "Math",
    "Bahasa Indonesia",
    "Natural Science",
    "Social Science",
    "English",
  ]),
  prompt: z.string().optional(),
  // Remove customSubject and prompt if not needed
});

export const agentsUpdateSchema = agentsInsertSchema.extend({
  id: z.string().min(1, "Agent ID is required"),
});