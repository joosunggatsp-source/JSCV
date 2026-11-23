import { defineConfig } from 'astro/config';

// Where the site is published. After buying a domain, change these two
// defaults to 'https://your-domain' and '/'. See docs/guide.md.
const SITE_URL = process.env.SITE_URL ?? 'https://joosunggatsp-source.github.io';
const SITE_BASE = process.env.SITE_BASE ?? '/JSCV';

export default defineConfig({
  site: SITE_URL,
  base: SITE_BASE,
});
