import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { build } from './helpers.mjs';

let site, home, withBody, emptyBody;
before(async () => {
  site = await build({ PROJECTS_DIR: 'tests/fixtures/details' });
  home = site.read('index.html');
  withBody = site.exists('projects/with-body/index.html') ? site.read('projects/with-body/index.html') : '';
  emptyBody = site.exists('projects/empty-body/index.html') ? site.read('projects/empty-body/index.html') : '';
});

test('page exists only when details is on', () => {
  assert.equal(site.exists('projects/with-body/index.html'), true);
  assert.equal(site.exists('projects/empty-body/index.html'), true);
  assert.equal(site.exists('projects/off/index.html'), false);
});

test('home links the title to the page', () => {
  assert.match(home, /<a[^>]*href="\/JSCV\/projects\/with-body\/"[^>]*>\s*With Body/);
  assert.doesNotMatch(home, /<a[^>]*>\s*Off\s*</);
  assert.match(home, />\s*Off\s*</);
});

test('a section with no projects shows a placeholder', () => {
  const start = home.indexOf('Medical Devices');
  const end = home.indexOf('Automation');
  assert.ok(start !== -1 && end > start);
  assert.match(home.slice(start, end), /\[Nothing here yet\]/);
});

test('a written body is shown as written', () => {
  assert.match(withBody, /<h1[^>]*>\s*With Body\s*<\/h1>/);
  assert.match(withBody, /Fixture problem text\./);
  assert.doesNotMatch(withBody, /\[Describe the problem\]/);
});

test('an empty body shows the three headings with placeholders', () => {
  const order = [
    'Problem', '[Describe the problem]',
    'What I did', '[Describe what you did]',
    'Result', '[Describe the result]',
  ].map((text) => emptyBody.indexOf(text));
  assert.ok(order.every((i) => i !== -1), `missing heading or placeholder: ${order}`);
  assert.deepEqual(order, [...order].sort((a, b) => a - b));
});

test('page links back to home', () => {
  assert.match(withBody, /href="\/JSCV\/"/);
  assert.match(emptyBody, /href="\/JSCV\/"/);
});

test('detail pages have no scripts, images or motion', () => {
  for (const page of [withBody, emptyBody]) {
    assert.ok(page.length > 0);
    assert.doesNotMatch(page, /<script/i);
    assert.doesNotMatch(page, /<img/i);
    assert.doesNotMatch(page, /transition|animation/i);
  }
});
