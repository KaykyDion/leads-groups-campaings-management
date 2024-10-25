import { z } from "zod";

const leadStatusSchema = z.enum([
  "New",
  "Contacted",
  "Qualified",
  "Converted",
  "Unresponsive",
  "Disqualified",
  "Archived",
]);

export const GetLeadsRequestSchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  name: z.string().optional(),
  status: leadStatusSchema.optional(),
  sortBy: z.enum(["name", "status", "createdAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export const CreateLeadRequestSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  status: leadStatusSchema.optional(),
});

export const UpdateLeadRequestSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  status: leadStatusSchema.optional(),
});
