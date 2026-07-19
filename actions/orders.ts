'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, 'Veuillez saisir votre nom complet.').max(120),
  phone: z.string().trim().min(9, 'Veuillez saisir un numéro de téléphone valide.').max(30),
  city: z.string().trim().min(2, 'Veuillez choisir votre ville.').max(100),
  address: z.string().trim().min(5, 'Veuillez saisir votre adresse de livraison.').max(250),
  notes: z.string().trim().max(500).optional(),
  items: z.array(z.object({
    productId: z.coerce.number().int().positive(),
    variantId: z.coerce.number().int().positive().optional(),
    quantity: z.coerce.number().int().min(1).max(20),
  })).min(1, 'Votre panier est vide.'),
});

export type CheckoutState = {
  success: boolean;
  error?: string;
  orderNumber?: string;
};

const ORDER_STATUSES: Record<string, string> = {
  NEW: 'Nouvelle',
  CONFIRMED: 'Confirmée',
  PREPARING: 'En préparation',
  SHIPPED: 'Expédiée',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
};

export async function createOrder(_previousState: CheckoutState | null, formData: FormData): Promise<CheckoutState> {
  try {
    let items: unknown = [];
    try {
      items = JSON.parse(String(formData.get('items') || '[]'));
    } catch {
      return { success: false, error: 'Le contenu du panier est invalide.' };
    }

    const parsed = checkoutSchema.safeParse({
      customerName: formData.get('customerName'),
      phone: formData.get('phone'),
      city: formData.get('city'),
      address: formData.get('address'),
      notes: formData.get('notes') || undefined,
      items,
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Veuillez vérifier vos informations.' };
    }

    const productIds = [...new Set(parsed.data.items.map((item) => item.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isVisible: true },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        variants: { select: { id: true, name: true, price: true, stock: true } },
      },
    });

    if (products.length !== productIds.length) {
      return { success: false, error: 'Un produit de votre panier n’est plus disponible.' };
    }

    const productById = new Map(products.map((product) => [product.id, product]));
    const orderItems = parsed.data.items.map((item) => {
      const product = productById.get(item.productId)!;
      const variant = item.variantId ? product.variants.find((entry) => entry.id === item.variantId) : undefined;
      if (product.variants.length > 0 && !variant) {
        throw new Error(`VARIANT_REQUIRED:${product.name}`);
      }
      const availableStock = variant?.stock ?? product.stock;
      if (availableStock < item.quantity) {
        throw new Error(`OUT_OF_STOCK:${product.name}`);
      }
      return {
        productId: product.id,
        productName: product.name,
        variantId: variant?.id ?? null,
        variantName: variant?.name ?? null,
        quantity: item.quantity,
        unitPrice: variant?.price ?? product.price,
      };
    });
    const total = orderItems.reduce(
      (sum, item) => sum + Number(item.unitPrice) * item.quantity,
      0,
    );
    const orderNumber = `DH-${Date.now().toString().slice(-8)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

    const session = await auth();
    const sessionUserId = Number(session?.user?.id);
    const userId = Number.isInteger(sessionUserId) && sessionUserId > 0 ? sessionUserId : null;

    await prisma.$transaction(async (transaction) => {
      for (const item of orderItems) {
        const stockUpdate = item.variantId
          ? await transaction.productVariant.updateMany({
              where: { id: item.variantId, stock: { gte: item.quantity } },
              data: { stock: { decrement: item.quantity } },
            })
          : await transaction.product.updateMany({
              where: { id: item.productId, stock: { gte: item.quantity } },
              data: { stock: { decrement: item.quantity } },
            });
        if (stockUpdate.count !== 1) throw new Error(`OUT_OF_STOCK:${item.productName}`);
        if (item.variantId) {
          await transaction.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      await transaction.order.create({
        data: {
          orderNumber,
          customerName: parsed.data.customerName,
          phone: parsed.data.phone,
          city: parsed.data.city,
          address: parsed.data.address,
          notes: parsed.data.notes || null,
          total,
          status: 'NEW',
          userId,
          items: { create: orderItems },
          statusHistory: {
            create: { status: 'NEW', note: 'Commande créée avec paiement à la livraison.' },
          },
        },
      });
    });

    revalidatePath('/admin');
    revalidatePath('/admin/commandes');
    revalidatePath('/account');
    return { success: true, orderNumber };
  } catch (error) {
    console.error('Order creation failed:', error);
    if (error instanceof Error && error.message.startsWith('OUT_OF_STOCK:')) {
      return { success: false, error: `Stock insuffisant pour ${error.message.split(':').slice(1).join(':')}.` };
    }
    if (error instanceof Error && error.message.startsWith('VARIANT_REQUIRED:')) {
      return { success: false, error: `Veuillez choisir une taille pour ${error.message.split(':').slice(1).join(':')}.` };
    }
    return { success: false, error: 'La commande n’a pas pu être enregistrée. Veuillez réessayer.' };
  }
}

export async function getOrders() {
  await requireAdmin();
  return prisma.order.findMany({
    include: {
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getOrderById(id: number) {
  await requireAdmin();
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: { include: { images: { where: { isMain: true }, take: 1 } } } } },
      statusHistory: { orderBy: { createdAt: 'asc' } },
    },
  });
}

export async function getCustomerOrders() {
  const session = await auth();
  const userId = Number(session?.user?.id);
  if (!Number.isInteger(userId) || userId <= 0 || session?.user?.role !== 'CUSTOMER') return [];
  return prisma.order.findMany({
    where: { userId },
    include: { items: true, statusHistory: { orderBy: { createdAt: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getCustomerOrderById(id: number) {
  const session = await auth();
  const userId = Number(session?.user?.id);
  if (!Number.isInteger(userId) || userId <= 0 || session?.user?.role !== 'CUSTOMER') return null;
  return prisma.order.findFirst({
    where: { id, userId },
    include: {
      items: { include: { product: { select: { slug: true, name: true } } } },
      statusHistory: { orderBy: { createdAt: 'asc' } },
    },
  });
}

export async function updateOrderStatus(id: number, status: string, note?: string) {
  try {
    await requireAdmin();

    if (!ORDER_STATUSES[status]) {
      return { success: false, error: 'Statut invalide' };
    }

    await prisma.$transaction([
      prisma.order.update({ where: { id }, data: { status } }),
      prisma.orderStatusHistory.create({
        data: {
          orderId: id,
          status,
          note: note ?? `Statut changé en "${ORDER_STATUSES[status]}"`,
        },
      }),
    ]);

    revalidatePath('/admin/commandes');
    revalidatePath(`/admin/commandes/${id}`);
    revalidatePath('/account');
    return { success: true };
  } catch {
    return { success: false, error: 'Une erreur est survenue. Veuillez réessayer.' };
  }
}

export async function getDashboardStats() {
  await requireAdmin();
  const [
    totalProducts,
    totalCategories,
    pendingOrders,
    outOfStock,
    recentProducts,
    recentOrders,
    alerts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count({ where: { status: 'NEW' } }),
    prisma.product.count({ where: { stock: 0 } }),
    prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } },
        images: { where: { isMain: true }, take: 1 },
      },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    Promise.all([
      prisma.product.count({ where: { images: { none: {} } } }),
      prisma.product.count({ where: { stock: 0, isVisible: true } }),
      prisma.category.count({ where: { products: { none: {} } } }),
    ]),
  ]);

  return {
    totalProducts,
    totalCategories,
    pendingOrders,
    outOfStock,
    recentProducts,
    recentOrders,
    alertProductsNoImage: alerts[0],
    alertProductsOutOfStock: alerts[1],
    alertEmptyCategories: alerts[2],
  };
}
