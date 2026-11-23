import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { build } from './helpers.mjs';

let html;
before(async () => { html = (await build()).read('index.html'); });

test('shows name, tagline and the four nav links', () => {
  assert.match(html, /Test Person/);
  assert.match(html, /Fixture tagline/);
  for (const id of ['about', 'work', 'cv', 'contact']) {
    assert.match(html, new RegExp(`href="/JSCV/#${id}"`));
    assert.match(html, new RegExp(`id="${id}"`));
  }
});

test('shows every about paragraph', () => {
  assert.match(html, /<p[^>]*>Fixture about one\.<\/p>/);
  assert.match(html, /<p[^>]*>Fixture about two\.<\/p>/);
});

test('shows CV groups with their items', () => {
  for (const text of ['>Education<', 'Fixture degree', '>Skills<', 'Fixture skill one', 'Fixture skill two']) {
    assert.ok(html.includes(text), `missing: ${text}`);
  }
});

test('links the CV PDF when one is set', () => {
  assert.match(html, /<a[^>]*href="\/JSCV\/cv\.pdf"[^>]*>\s*CV \(PDF\)/);
});

test('contact entries are links only when they have a url', () => {
  assert.match(html, /<a[^>]*href="https:\/\/example\.test\/profile"[^>]*>\s*Linked entry/);
  assert.match(html, /Plain entry/);
  assert.doesNotMatch(html, /<a[^>]*>\s*Plain entry/);
});

test('page has no scripts, images or motion', () => {
  assert.doesNotMatch(html, /<script/i);
  assert.doesNotMatch(html, /<img/i);
  assert.doesNotMatch(html, /transition|animation/i);
});
