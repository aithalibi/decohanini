import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      database: 'ok',
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      { database: 'unavailable', status: 'error' },
      { status: 503 }
    );
  }
}
