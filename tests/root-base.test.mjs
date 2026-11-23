import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { build } from './helpers.mjs';

// The site as it is built for its own domain, served from the root.
let home, detail;
before(async () => {
  const site = await build({
    SITE_URL: 'https://example.com',
    SITE_BASE: '/',
    PROJECTS_DIR: 'tests/fixtures/details',
  });
  home = site.read('index.html');
  detail = site.read('projects/with-body/index.html');
});

test('no URL keeps the sub-path', () => {
  assert.doesNotMatch(home, /\/JSCV/);
  assert.doesNotMatch(detail, /\/JSCV/);
});

test('links resolve at the root', () => {
  assert.match(home, /href="\/#about"/);
  assert.match(home, /href="\/projects\/with-body\/"/);
  assert.match(detail, /href="\/"/);
});
