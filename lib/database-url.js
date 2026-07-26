function decodeComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function encodeComponent(value) {
  return encodeURIComponent(decodeComponent(value));
}

function connectionHost(hostname) {
  return hostname === 'localhost' ? '127.0.0.1' : hostname;
}

/**
 * Normalizes credentials in a MySQL URL so passwords containing URL-reserved
 * characters (such as ?, #, or @) work in Hostinger environment variables.
 */
export function normalizeMysqlDatabaseUrl(value) {
  const input = value
    ?.trim()
    .replace(/^(['"])(.*)\1$/, '$2')
    .replace(/^DATABASE_URL\s*=\s*/i, '');

  if (!input?.startsWith('mysql://')) {
    throw new Error('DATABASE_URL must start with mysql://.');
  }

  try {
    const parsed = new URL(input);
    const database = parsed.pathname.replace(/^\//, '');

    if (!parsed.hostname || !parsed.username || !database) {
      throw new Error('DATABASE_URL must contain a host, user and database name.');
    }

    const host = connectionHost(parsed.hostname);
    return `mysql://${encodeComponent(parsed.username)}:${encodeComponent(parsed.password)}@${host}${parsed.port ? `:${parsed.port}` : ''}/${encodeComponent(database)}${parsed.search}`;
  } catch (error) {
    // URL() rejects unescaped reserved characters in passwords, so split the
    // known MySQL URL shape and encode credentials before parsing it again.
    const match = input.match(/^mysql:\/\/([^:/]+):(.*)@([^:/]+)(?::(\d+))?\/([^?#]+)$/);

    if (!match) {
      throw error;
    }

    const [, username, password, hostname, port, database] = match;
    const normalized = `mysql://${encodeComponent(username)}:${encodeComponent(password)}@${connectionHost(hostname)}${port ? `:${port}` : ''}/${encodeComponent(database)}`;

    // Validate the normalized value before passing it to Prisma or mysql2.
    new URL(normalized);
    return normalized;
  }
}
