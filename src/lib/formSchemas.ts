import { z } from "astro/zod";

const honeypot = z.string().max(0).optional();

export const newsletterSchema = z.object({
  email: z.string().trim().email().max(254),
  website: honeypot,
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(3).max(140).optional(),
  message: z.string().trim().min(10).max(4000),
  website: honeypot,
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
