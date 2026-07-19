import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom est trop long'),
  description: z.string().max(500, 'La description est trop longue').optional(),
  imageUrl: z.string().optional(),
  isVisible: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
