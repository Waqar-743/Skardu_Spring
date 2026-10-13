import { cp, mkdir, rm, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const frontend = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const staging = path.join(frontend, '.pages-build');
// Build a separate static copy; leave the full Next.js server and APIs intact.
if (path.dirname(staging) !== frontend || path.basename(staging) !== '.pages-build') {
  throw new Error('Invalid Pages staging directory');
}
await rm(staging, { recursive: true, force: true });
await mkdir(staging, { recursive: true });
for (const entry of ['src', 'public', 'package.json', 'jsconfig.json', 'next.config.mjs']) {
  await cp(path.join(frontend, entry), path.join(staging, entry), {
    recursive: true,
    filter: source => {
      const relative = path.relative(frontend, source).replaceAll('\\', '/');
      return relative !== 'src/proxy.js' && relative !== 'src/app/api'
        && !relative.endsWith('-original.png') && !relative.endsWith('/image-prompts.json');
    },
  });
}
const require = createRequire(path.join(frontend, 'package.json'));
const result = spawnSync(process.execPath, [require.resolve('next/dist/bin/next'), 'build', staging, '--webpack'], {
  cwd: frontend,
  stdio: 'inherit',
  env: {
    ...process.env,
    NEXT_PUBLIC_DEPLOY_TARGET: 'github-pages',
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || '/Skardu-Spring',
  },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);

// Next 16's segment exporter flattens '/' but Windows supplies '\\'. Ensure
// locally exported route payloads have the same URLs as Linux Pages builds.
async function normalizeSegments(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === '_next') continue;
    const child = path.join(directory, entry.name);
    if (entry.name.startsWith('__next.')) {
      async function flatten(current) {
        for (const file of await readdir(current, { withFileTypes: true })) {
          const source = path.join(current, file.name);
          if (file.isDirectory()) await flatten(source);
          else if (file.name.endsWith('.txt')) {
            const suffix = path.relative(child, source).split(path.sep).join('.');
            await cp(source, path.join(directory, `${entry.name}.${suffix}`));
          }
        }
      }
      await flatten(child);
    } else await normalizeSegments(child);
  }
}
await normalizeSegments(path.join(staging, 'out'));
await writeFile(path.join(staging, 'out', '.nojekyll'), '');
console.log(`GitHub Pages files: ${path.join(staging, 'out')}`);
