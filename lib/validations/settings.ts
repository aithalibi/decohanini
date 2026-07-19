import { z } from 'zod';

export const settingsSchema = z.object({
  storeName: z.string().min(1, 'Nom requis').max(100),
  whatsappNumber: z.string().min(1, 'Numéro WhatsApp requis').max(20),
  phone: z.string().max(20).optional(),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  address: z.string().max(300).optional(),
  heroTitle: z.string().max(200).optional(),
  heroSubtitle: z.string().max(300).optional(),
  heroImageUrl: z.string().optional(),
  instagramUrl: z.string().url('URL Instagram invalide').optional().or(z.literal('')),
  facebookUrl: z.string().url('URL Facebook invalide').optional().or(z.literal('')),
  deliveryText: z.string().max(200).optional(),
  paymentText: z.string().max(200).optional(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
