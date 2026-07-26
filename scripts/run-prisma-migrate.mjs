import { createHash, randomUUID } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import nextEnv from '@next/env';
import mysql from 'mysql2/promise';
import { normalizeMysqlDatabaseUrl } from '../lib/database-url.js';

const { loadEnvConfig } = nextEnv;
const projectRoot = process.cwd();
const migrationsDirectory = path.join(projectRoot, 'prisma', 'migrations');

const legacyTableNames = new Map([
  ['User', 'user'],
  ['Category', 'category'],
  ['Product', 'product'],
  ['ProductImage', 'productimage'],
  ['Order', 'order'],
  ['OrderItem', 'orderitem'],
  ['OrderStatusHistory', 'orderstatushistory'],
  ['SiteSettings', 'sitesettings'],
]);

const recoverableSchemaErrors = new Set([
  'ER_TABLE_EXISTS_ERROR',
  'ER_DUP_FIELDNAME',
  'ER_DUP_KEYNAME',
  'ER_FK_DUP_NAME',
]);

loadEnvConfig(projectRoot);

function connectionOptions(databaseUrl) {
  let parsedUrl;

  try {
    parsedUrl = new URL(normalizeMysqlDatabaseUrl(databaseUrl));
  } catch {
    throw new Error('DATABASE_URL must be a valid MySQL connection URL.');
  }

  if (parsedUrl.protocol !== 'mysql:') {
    throw new Error('DATABASE_URL must use the mysql:// protocol.');
  }

  const database = decodeURIComponent(parsedUrl.pathname.replace(/^\//, ''));
  if (!parsedUrl.hostname || !parsedUrl.username || !database) {
    throw new Error('DATABASE_URL must contain a host, user and database name.');
  }

  return {
    host: parsedUrl.hostname,
    port: Number(parsedUrl.port || 3306),
    user: decodeURIComponent(parsedUrl.username),
    password: decodeURIComponent(parsedUrl.password),
    database,
    charset: 'utf8mb4',
    multipleStatements: true,
  };
}

async function loadMigrations() {
  const entries = await readdir(migrationsDirectory, { withFileTypes: true });
  const migrations = [];

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    if (!entry.isDirectory() || !/^\d+_[a-z0-9_]+$/i.test(entry.name)) continue;

    const sqlPath = path.join(migrationsDirectory, entry.name, 'migration.sql');
    const sqlBuffer = await readFile(sqlPath);
    migrations.push({
      name: entry.name,
      sql: sqlBuffer.toString('utf8'),
      checksum: createHash('sha256').update(sqlBuffer).digest('hex'),
    });
  }

  return migrations;
}

function migrationChecksumVariants(sqlBuffer) {
  const raw = createHash('sha256').update(sqlBuffer).digest('hex');
  const text = sqlBuffer.toString('utf8');
  const withoutBom = text.replace(/^\uFEFF/, '');
  const lfNormalized = withoutBom.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const crlfNormalized = withoutBom.replace(/\r?\n/g, '\r\n');

  return new Set([
    raw,
    createHash('sha256').update(Buffer.from(withoutBom, 'utf8')).digest('hex'),
    createHash('sha256').update(Buffer.from(lfNormalized, 'utf8')).digest('hex'),
    createHash('sha256').update(Buffer.from(crlfNormalized, 'utf8')).digest('hex'),
  ]);
}

async function ensureMigrationTable(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`_prisma_migrations\` (
      \`id\` VARCHAR(36) NOT NULL,
      \`checksum\` VARCHAR(64) NOT NULL,
      \`finished_at\` DATETIME(3) NULL,
      \`migration_name\` VARCHAR(255) NOT NULL,
      \`logs\` TEXT NULL,
      \`rolled_back_at\` DATETIME(3) NULL,
      \`started_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`applied_steps_count\` INT UNSIGNED NOT NULL DEFAULT 0,
      PRIMARY KEY (\`id\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
}

async function normalizeLegacyTableNames(connection) {
  const [rows] = await connection.query(`
    SELECT \`TABLE_NAME\` AS \`tableName\`
    FROM \`information_schema\`.\`TABLES\`
    WHERE \`TABLE_SCHEMA\` = DATABASE()
  `);
  const existingNames = new Set(rows.map((row) => row.tableName));
  const renames = [];

  for (const [legacyName, currentName] of legacyTableNames) {
    if (existingNames.has(legacyName) && !existingNames.has(currentName)) {
      renames.push(`\`${legacyName}\` TO \`${currentName}\``);
    }
  }

  if (renames.length === 0) return;

  await connection.query(`RENAME TABLE ${renames.join(', ')}`);
  console.log(`Normalized legacy table names: ${renames.join(', ')}.`);
}

function migrationStatements(sql) {
  return sql
    .replace(/^\s*--.*$/gm, '')
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);
}

async function executeMigration(connection, migration) {
  const statements = migrationStatements(migration.sql);
  let appliedSteps = 0;

  for (const statement of statements) {
    try {
      await connection.query(statement);
    } catch (error) {
      if (!recoverableSchemaErrors.has(error?.code)) throw error;
      console.warn(`Schema element already exists while resuming ${migration.name}; continuing.`);
    }
    appliedSteps += 1;
  }

  return appliedSteps;
}

async function applyMigrations(connection, migrations) {
  const [rows] = await connection.query(`
    SELECT \`id\`, \`migration_name\`, \`checksum\`, \`finished_at\`, \`rolled_back_at\`
    FROM \`_prisma_migrations\`
    ORDER BY \`started_at\` ASC
  `);
  const appliedMigrations = new Map(rows.map((row) => [row.migration_name, row]));

  for (const migration of migrations) {
    const applied = appliedMigrations.get(migration.name);

    if (applied?.finished_at && !applied.rolled_back_at) {
      if (!migrationChecksumVariants(Buffer.from(migration.sql, 'utf8')).has(applied.checksum)) {
        throw new Error(`Migration ${migration.name} was modified after being applied.`);
      }
      console.log(`Migration already applied: ${migration.name}`);
      continue;
    }

    if (applied && !applied.rolled_back_at) {
      if (!migrationChecksumVariants(Buffer.from(migration.sql, 'utf8')).has(applied.checksum)) {
        throw new Error(`Migration ${migration.name} changed after an unfinished attempt.`);
      }

      console.warn(`Resuming migration after an unfinished attempt: ${migration.name}`);
      await connection.execute(
        'UPDATE `_prisma_migrations` SET `rolled_back_at` = CURRENT_TIMESTAMP(3) WHERE `id` = ?',
        [applied.id]
      );
    }

    const migrationId = randomUUID();
    await connection.execute(
      'INSERT INTO `_prisma_migrations` (`id`, `checksum`, `migration_name`) VALUES (?, ?, ?)',
      [migrationId, migration.checksum, migration.name]
    );

    try {
      console.log(`Applying migration: ${migration.name}`);
      const appliedSteps = await executeMigration(connection, migration);
      await connection.execute(
        'UPDATE `_prisma_migrations` SET `finished_at` = CURRENT_TIMESTAMP(3), `applied_steps_count` = ? WHERE `id` = ?',
        [appliedSteps, migrationId]
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await connection.execute(
        'UPDATE `_prisma_migrations` SET `logs` = ? WHERE `id` = ?',
        [message, migrationId]
      );
      throw error;
    }
  }
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is required.');

  const options = connectionOptions(databaseUrl);
  const migrations = await loadMigrations();
  const connection = await mysql.createConnection(options);

  console.log(`Connected to MySQL database ${options.database} at ${options.host}:${options.port}.`);

  try {
    await ensureMigrationTable(connection);
    await normalizeLegacyTableNames(connection);
    await applyMigrations(connection, migrations);
    console.log('Database migrations are up to date.');
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error('Database migration failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
