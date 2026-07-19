'use server';

import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export async function getCustomers() {
  await requireAdmin();
  return prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    include: {
      _count: { select: { orders: true } },
      orders: { select: { total: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}
