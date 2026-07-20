import path from 'node:path';
import nextEnv from '@next/env';

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const errors = [];

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) errors.push(`${name} is required.`);
  return value ?? '';
}

const databaseUrl = required('DATABASE_URL');
const authSecret = required('AUTH_SECRET');
const applicationUrl = required('NEXTAUTH_URL');
const adminIdentifier = required('ADMIN_EMAIL');
const adminPassword = required('ADMIN_PASSWORD');
const uploadDirectory = required('UPLOAD_DIR');
const uploadUrl = required('NEXT_PUBLIC_UPLOAD_URL');

if (databaseUrl && !databaseUrl.startsWith('mysql://')) {
  errors.push('DATABASE_URL must use the mysql:// protocol.');
}

if (databaseUrl && /DB_(USER|PASSWORD|HOST|NAME)|replace|example/i.test(databaseUrl)) {
  errors.push('DATABASE_URL still contains example values. Use the real Hostinger MySQL credentials.');
}

if (authSecret && (authSecret.length < 32 || /replace|change/i.test(authSecret))) {
  errors.push('AUTH_SECRET must be a real random secret of at least 32 characters.');
}

if (applicationUrl) {
  try {
    const parsedUrl = new URL(applicationUrl);
    const isLocal = ['localhost', '127.0.0.1'].includes(parsedUrl.hostname);
    if (!isLocal && parsedUrl.protocol !== 'https:') {
      errors.push('NEXTAUTH_URL must use HTTPS outside localhost.');
    }
  } catch {
    errors.push('NEXTAUTH_URL must be a valid absolute URL.');
  }
}

if (adminIdentifier && /replace|change/i.test(adminIdentifier)) {
  errors.push('ADMIN_EMAIL must contain the production admin identifier.');
}

if (
  adminPassword &&
  (adminPassword.length < 10 || /^(admin|password|123456)$/i.test(adminPassword) || /replace|change/i.test(adminPassword))
) {
  errors.push('ADMIN_PASSWORD must be a strong password of at least 10 characters.');
}

if (uploadDirectory) {
  const resolvedUploadDirectory = path.resolve(process.cwd(), uploadDirectory);
  const bundledUploadDirectory = path.resolve(process.cwd(), 'public', 'uploads');

  if (!path.isAbsolute(uploadDirectory)) {
    errors.push('UPLOAD_DIR must be an absolute persistent directory in production.');
  }

  if (resolvedUploadDirectory === bundledUploadDirectory) {
    errors.push('UPLOAD_DIR must not be public/uploads because deployments can replace that directory.');
  }
}

if (uploadUrl && uploadUrl !== '/media') {
  errors.push('NEXT_PUBLIC_UPLOAD_URL must be /media for the persistent upload route.');
}

if (errors.length > 0) {
  console.error('\nDeployment configuration is not ready:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Deployment environment validated.');
