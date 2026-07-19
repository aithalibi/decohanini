import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { getUploadDirectory } from '@/lib/uploads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

function notFound() {
  return NextResponse.json({ error: 'Image introuvable' }, { status: 404 });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (!/^[a-zA-Z0-9._-]+$/.test(filename) || filename.includes('..')) {
    return notFound();
  }

  const uploadsDirectory = path.resolve(getUploadDirectory());
  const filePath = path.resolve(uploadsDirectory, filename);

  if (!filePath.startsWith(`${uploadsDirectory}${path.sep}`)) {
    return notFound();
  }

  try {
    const file = await readFile(filePath);
    const contentType = MIME_TYPES[path.extname(filename).toLowerCase()];

    if (!contentType) return notFound();

    return new Response(new Uint8Array(file), {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': String(file.byteLength),
        'Content-Type': contentType,
      },
    });
  } catch {
    return notFound();
  }
}
