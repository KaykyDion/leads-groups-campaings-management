import { z } from "zod";

export const CreateCampaignRequestSchema = z.object({
  name: z.string(),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
});

export const UpdateCampaignRequestSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.string().optional(),
});
