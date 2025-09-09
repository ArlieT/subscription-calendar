import { z } from "zod";

export const subscriptionSchema = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 character",
  }),
  cost: z.number().min(1, {
    message: "Cost must be at least $1",
  }),
  cycle: z.enum(["daily", "weekly", "monthly", "yearly"]),
  description: z.string().min(1, {
    message: "Description must be at least 1 character",
  }),
  tags: z
    .array(
      z.string().min(1, {
        message: "Tag must be at least 1 character",
      }),
    )
    .min(1, {
      message: "At least one tag is required",
    }),
});

export type SubscriptionType = z.infer<typeof subscriptionSchema>;
