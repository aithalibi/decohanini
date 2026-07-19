'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { categorySchema } from '@/lib/validations/category';
import { revalidatePath } from 'next/cache';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[&]/g, 'et')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function getCategoryById(id: number) {
  return prisma.category.findUnique({ where: { id } });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function createCategory(_prevState: unknown, formData: FormData) {
  try {
    await requireAdmin();

    const raw = {
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || undefined,
      imageUrl: (formData.get('imageUrl') as string) || undefined,
      isVisible: formData.get('isVisible') === 'true',
      sortOrder: Number(formData.get('sortOrder') || 0),
    };

    const parsed = categorySchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const slug = generateSlug(parsed.data.name);

    // Garantir l'unicité du slug
    const existing = await prisma.category.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    await prisma.category.create({
      data: { ...parsed.data, slug: finalSlug },
    });

    revalidatePath('/admin/categories');
    revalidatePath('/');
    revalidatePath('/boutique');
    return { success: true };
  } catch {
    return { success: false, error: 'Une erreur est survenue. Veuillez réessayer.' };
  }
}

export async function updateCategory(id: number, _prevState: unknown, formData: FormData) {
  try {
    await requireAdmin();

    const raw = {
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || undefined,
      imageUrl: (formData.get('imageUrl') as string) || undefined,
      isVisible: formData.get('isVisible') === 'true',
      sortOrder: Number(formData.get('sortOrder') || 0),
    };

    const parsed = categorySchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await prisma.category.update({ where: { id }, data: parsed.data });

    revalidatePath('/admin/categories');
    revalidatePath('/');
    revalidatePath('/boutique');
    revalidatePath(`/categorie/${(await prisma.category.findUnique({ where: { id }, select: { slug: true } }))?.slug ?? ''}`);
    return { success: true };
  } catch {
    return { success: false, error: 'Une erreur est survenue. Veuillez réessayer.' };
  }
}

export async function deleteCategory(id: number) {
  try {
    await requireAdmin();
    await prisma.category.delete({ where: { id } });
    revalidatePath('/admin/categories');
    revalidatePath('/');
    revalidatePath('/boutique');
    return { success: true };
  } catch {
    return { success: false, error: 'Une erreur est survenue. Veuillez réessayer.' };
  }
}
