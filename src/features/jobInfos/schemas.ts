import z from "zod";
import { experienceLevels } from "@/drizzle/schema/jobInfo";

export const formSchema = z.object({
  name: z.string().min(1, "Required"),
  title: z.string().nullable(),
  experienceLevel: z.enum(experienceLevels),
  description: z.string().min(1, "Required"),
});