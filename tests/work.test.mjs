import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { build } from './helpers.mjs';

let site, html;
before(async () => {
  site = await build();
  html = site.read('index.html');
});

const at = (text) => {
  const i = html.indexOf(text);
  assert.notEqual(i, -1, `missing: ${text}`);
  return i;
};

test('sections appear in settings order inside #work', () => {
  const work = at('id="work"');
  assert.ok(work < at('Medical Devices'));
  assert.ok(at('Medical Devices') < at('Automation'));
});

test('rows appear in order with summaries', () => {
  assert.ok(at('[Artificial Valve]') < at('[Catheter Valve]'));
  assert.ok(at('[Catheter Valve]') < at('[EGG Device]'));
  assert.ok(at('[Smart Farm Automation]') < at('[Factory Automation]'));
  assert.equal(html.split('[one-line summary]').length - 1, 5);
});

test('rows are not links while details is off', () => {
  assert.doesNotMatch(html, /<a[^>]*>\s*\[Artificial Valve\]/);
  assert.equal(site.exists('projects/artificial-valve/index.html'), false);
});
