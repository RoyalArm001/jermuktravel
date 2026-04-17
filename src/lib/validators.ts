import { z } from "zod";

const optionalText = (maxLength: number) =>
  z
    .union([z.string().trim().max(maxLength), z.literal("")])
    .optional()
    .transform((value) => {
      const normalized = value?.trim();
      return normalized ? normalized : undefined;
    });

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password is too long."),
});

export const registerSchema = signInSchema.extend({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(60, "Name is too long."),
  phone: optionalText(30),
});

export const inquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter the guest name.")
    .max(80, "Name is too long."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: optionalText(30),
  travelWindow: optionalText(80),
  guests: z.coerce
    .number()
    .int("Guests must be a whole number.")
    .min(1, "At least one guest is required.")
    .max(12, "Please contact us for larger groups."),
  tripStyle: z
    .union([
      z.enum([
        "WELLNESS",
        "ADVENTURE",
        "FAMILY",
        "ROMANTIC",
        "WORKATION",
        "CUSTOM",
      ]),
      z.literal(""),
    ])
    .optional()
    .transform((value) => (value ? value : undefined)),
  destinationLabel: optionalText(80),
  packageLabel: optionalText(80),
  message: z
    .string()
    .trim()
    .min(10, "Please add a few trip details.")
    .max(1000, "Message is too long."),
});

const storyMediaSchema = z.object({
  imageUrl: z
    .string()
    .trim()
    .url("Each gallery image must be a valid URL."),
  caption: optionalText(160),
});

export const createStorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(120, "Title is too long."),
  location: z
    .string()
    .trim()
    .min(2, "Please add a location.")
    .max(120, "Location is too long."),
  country: optionalText(80),
  coverImageUrl: z
    .union([z.string().trim().url("Cover image URL must be valid."), z.literal("")])
    .optional()
    .transform((value) => {
      const normalized = value?.trim();
      return normalized ? normalized : undefined;
    }),
  bestSeason: optionalText(80),
  excerpt: optionalText(240),
  content: z
    .string()
    .trim()
    .min(30, "Story content should be at least 30 characters.")
    .max(6000, "Story content is too long."),
  visibility: z
    .union([z.enum(["PUBLIC", "COMMUNITY", "PRIVATE"]), z.literal("")])
    .optional()
    .transform((value) => (value ? value : "PUBLIC")),
  tags: z
    .array(z.string().trim().min(1).max(32))
    .max(8, "Use up to 8 tags.")
    .optional()
    .default([]),
  gallery: z
    .array(storyMediaSchema)
    .max(8, "Use up to 8 gallery images.")
    .optional()
    .default([]),
});
