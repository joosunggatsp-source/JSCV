import { execFile } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Tests build from fixture settings, fixture projects and a fixed address, so
// they keep passing when the real site's text, projects or address change.
const fixtures = {
  SITE_URL: 'https://example.test',
  SITE_BASE: '/JSCV',
  SITE_CONFIG_FILE: 'tests/fixtures/site.config.ts',
  PROJECTS_DIR: 'tests/fixtures/projects',
};

// Builds the site into a fresh temp directory and returns readers for the output.
// Pass env to override the fixtures; buildLive() builds the real site instead.
export function build(env = {}) {
  const outDir = mkdtempSync(join(tmpdir(), 'jscv-build-'));
  return new Promise((resolve, reject) => {
    execFile(
      'npx',
      ['astro', 'build', '--outDir', outDir],
      { cwd: root, env: { ...process.env, ...fixtures, ...env }, maxBuffer: 16 * 1024 * 1024 },
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

// Builds the real site, with the real settings, projects and address.
export function buildLive() {
  return build({
    SITE_URL: undefined,
    SITE_BASE: undefined,
    SITE_CONFIG_FILE: undefined,
    PROJECTS_DIR: undefined,
  });
}
