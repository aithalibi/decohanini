import { chmod, copyFile, mkdir, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const projectRoot = process.cwd();
const enginesDirectory = path.join(projectRoot, 'node_modules', '@prisma', 'engines');
const prismaCli = path.join(projectRoot, 'node_modules', 'prisma', 'build', 'index.js');

async function findSchemaEngine() {
  const files = await readdir(enginesDirectory);
  const engineName = files.find((file) => {
    if (!file.startsWith('schema-engine-')) return false;
    return process.platform === 'win32'
      ? file.endsWith('.exe')
      : !file.endsWith('.gz') && !file.endsWith('.sha256');
  });

  if (!engineName) {
    throw new Error(`Prisma Schema Engine was not found in ${enginesDirectory}.`);
  }

  return path.join(enginesDirectory, engineName);
}

async function prepareSchemaEngine() {
  const installedEngine = await findSchemaEngine();

  if (process.platform === 'win32') {
    return installedEngine;
  }

  const executableDirectory = path.join(tmpdir(), `deco-hanini-prisma-${process.pid}`);
  const executableEngine = path.join(executableDirectory, path.basename(installedEngine));

  await mkdir(executableDirectory, { recursive: true });
  await copyFile(installedEngine, executableEngine);
  await chmod(executableEngine, 0o755);

  return executableEngine;
}

const schemaEngine = await prepareSchemaEngine();
console.log(`Using executable Prisma Schema Engine: ${schemaEngine}`);

const child = spawn(process.execPath, [prismaCli, 'migrate', 'deploy'], {
  cwd: projectRoot,
  env: {
    ...process.env,
    PRISMA_SCHEMA_ENGINE_BINARY: schemaEngine,
  },
  stdio: 'inherit',
});

const exitCode = await new Promise((resolve, reject) => {
  child.once('error', reject);
  child.once('exit', (code) => resolve(code ?? 1));
});

process.exitCode = exitCode;
