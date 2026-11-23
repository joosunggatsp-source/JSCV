import { resolve } from 'node:path';
import { defineConfig } from 'astro/config';

// Where the site is published. After buying a domain, change these two
// defaults to 'https://your-domain' and '/'. See docs/guide.md.
const SITE_URL = process.env.SITE_URL ?? 'https://joosunggatsp-source.github.io';
const SITE_BASE = process.env.SITE_BASE ?? '/JSCV';

// Tests swap in their own settings file; the site itself always uses the default.
const SITE_CONFIG_FILE = resolve(process.env.SITE_CONFIG_FILE ?? './src/site.config.ts');

export default defineConfig({
  site: SITE_URL,
  base: SITE_BASE,
  vite: {
    resolve: { alias: { '@site-config': SITE_CONFIG_FILE } },
  },
});
