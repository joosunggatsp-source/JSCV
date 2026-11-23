import { execFile } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Tests fix their own address so they keep passing when the real site's
// address in astro.config.mjs changes (for example to a bought domain).
const testAddress = { SITE_URL: 'https://example.test', SITE_BASE: '/JSCV' };

// Builds the site into a fresh temp directory and returns readers for the output.
export function build(env = {}) {
  const outDir = mkdtempSync(join(tmpdir(), 'jscv-build-'));
  return new Promise((resolve, reject) => {
    execFile(
      'npx',
      ['astro', 'build', '--outDir', outDir],
      { cwd: root, env: { ...process.env, ...testAddress, ...env }, maxBuffer: 16 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) return reject(new Error(`astro build failed:\n${stderr}\n${stdout}`));
        resolve({
          read: (path) => readFileSync(join(outDir, path), 'utf8'),
          exists: (path) => existsSync(join(outDir, path)),
        });
      },
    );
  });
}
