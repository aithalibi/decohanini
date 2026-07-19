'use server';

import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères.').max(80),
  email: z.string().trim().toLowerCase().email('Veuillez saisir une adresse e-mail valide.').max(190),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères.').max(72),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas.',
  path: ['confirmPassword'],
});

export type RegisterCustomerResult = {
  success: boolean;
  error?: string;
  email?: string;
};

export async function registerCustomer(formData: FormData): Promise<RegisterCustomerResult> {
  const parsed = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Veuillez vérifier vos informations.' };
  }

  const existingUser = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existingUser) {
    return { success: false, error: 'Un compte existe déjà avec cette adresse e-mail.' };
  }

  try {
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        role: 'CUSTOMER',
      },
    });
    return { success: true, email: parsed.data.email };
  } catch {
    return { success: false, error: 'La création du compte a échoué. Veuillez réessayer.' };
  }
}
