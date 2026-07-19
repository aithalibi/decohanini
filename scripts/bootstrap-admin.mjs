import nextEnv from '@next/env';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const identifier = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!identifier || !password) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required.');
}

if (password.length < 10 || /^(admin|password|123456)$/i.test(password)) {
  throw new Error('ADMIN_PASSWORD must contain at least 10 characters and must not be a default password.');
}

const prisma = new PrismaClient();

try {
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.user.upsert({
    where: { email: identifier },
    update: {
      passwordHash,
      role: 'ADMIN',
    },
    create: {
      email: identifier,
      name: 'Administrateur',
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log(`Admin account ready: ${admin.email}`);
} finally {
  await prisma.$disconnect();
}
