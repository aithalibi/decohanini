'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { settingsSchema } from '@/lib/validations/settings';
import { revalidatePath } from 'next/cache';

export async function getSettings() {
  let settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: { id: 1, storeName: 'Déco Hanini', whatsappNumber: '212777422673' },
    });
  }
  return settings;
}

export async function updateSettings(_prevState: unknown, formData: FormData) {
  try {
    await requireAdmin();

    const raw = {
      storeName: formData.get('storeName') as string,
      whatsappNumber: formData.get('whatsappNumber') as string,
      phone: (formData.get('phone') as string) || undefined,
      email: (formData.get('email') as string) || undefined,
      address: (formData.get('address') as string) || undefined,
      heroTitle: (formData.get('heroTitle') as string) || undefined,
      heroSubtitle: (formData.get('heroSubtitle') as string) || undefined,
      heroImageUrl: (formData.get('heroImageUrl') as string) || undefined,
      instagramUrl: (formData.get('instagramUrl') as string) || undefined,
      facebookUrl: (formData.get('facebookUrl') as string) || undefined,
      deliveryText: (formData.get('deliveryText') as string) || undefined,
      paymentText: (formData.get('paymentText') as string) || undefined,
    };

    const parsed = settingsSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: parsed.data,
      create: { id: 1, ...parsed.data },
    });

    revalidatePath('/admin/parametres');
    revalidatePath('/');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch {
    return { success: false, error: 'Une erreur est survenue. Veuillez réessayer.' };
  }
}
