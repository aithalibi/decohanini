import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { getUploadDirectory, getUploadFileUrl } from '@/lib/uploads';

export const runtime = 'nodejs';

const FILE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Aucun fichier recu' }, { status: 400 });
    }

    const extension = FILE_EXTENSIONS[file.type];
    if (!extension) {
      return NextResponse.json(
        { error: 'Format non accepte. Utilisez JPG, PNG ou WebP.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "L'image est trop lourde. Maximum 5 Mo." },
        { status: 400 }
      );
    }

    const uploadsDirectory = getUploadDirectory();
    await mkdir(uploadsDirectory, { recursive: true });

    const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
    const filePath = path.join(uploadsDirectory, fileName);

    await writeFile(filePath, new Uint8Array(await file.arrayBuffer()));

    return NextResponse.json({ url: getUploadFileUrl(fileName) });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'upload." },
      { status: 500 }
    );
  }
}
