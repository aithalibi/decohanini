import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(2, 'Veuillez ajouter un nom')
    .max(200, 'Le nom est trop long'),
  categoryId: z.coerce.number().int().positive('Veuillez choisir une catégorie'),
  price: z.coerce
    .number()
    .min(0, 'Le prix ne peut pas être négatif')
    .max(999999, 'Prix trop élevé'),
  oldPrice: z.coerce.number().positive().max(999999).optional().nullable(),
  shortDescription: z
    .string()
    .max(300, 'La description courte est trop longue')
    .optional(),
  description: z.string().optional(),
  stock: z.coerce.number().int().min(0, 'Le stock ne peut pas être négatif').default(0),
  isVisible: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isOnSale: z.boolean().default(false),
  colors: z.string().optional(),
  dimensions: z.string().max(200).optional(),
});

export const productVariantsSchema = z.array(z.object({
  name: z.string().trim().min(1, 'Ajoutez un nom de variante').max(80),
  price: z.coerce.number().positive('Le prix de la variante doit être supérieur à 0').max(999999),
  oldPrice: z.coerce.number().positive().max(999999).optional().nullable(),
  stock: z.coerce.number().int().min(0, 'Le stock ne peut pas être négatif'),
  imageUrl: z.string().trim().optional().nullable(),
})).max(20, 'Maximum 20 variantes par produit');

export type ProductFormData = z.infer<typeof productSchema>;
export type ProductVariantFormData = z.infer<typeof productVariantsSchema>[number];
