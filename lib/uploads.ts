import path from 'node:path';

const DEFAULT_UPLOAD_DIRECTORY = path.join(process.cwd(), 'public', 'uploads');

export function getUploadDirectory() {
  const configuredDirectory = process.env.UPLOAD_DIR?.trim();

  if (!configuredDirectory) return DEFAULT_UPLOAD_DIRECTORY;

  return path.resolve(/* turbopackIgnore: true */ process.cwd(), configuredDirectory);
}

export function getUploadBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_UPLOAD_URL?.trim();

  if (configuredUrl) return configuredUrl.replace(/\/+$/, '');

  return getUploadDirectory() === DEFAULT_UPLOAD_DIRECTORY ? '/uploads' : '/media';
}

export function getUploadFileUrl(fileName: string) {
  return `${getUploadBaseUrl()}/${encodeURIComponent(fileName)}`;
}
