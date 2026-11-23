import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { build } from './helpers.mjs';

let html;
before(async () => { html = (await build()).read('index.html'); });

test('shows name, tagline and the four nav links', () => {
  assert.match(html, /Joosung Lee/);
  assert.match(html, /\[One-line description\]/);
  for (const id of ['about', 'work', 'cv', 'contact']) {
    assert.match(html, new RegExp(`href="/JSCV/#${id}"`));
    assert.match(html, new RegExp(`id="${id}"`));
  }
});

test('shows about, CV groups and contact placeholders', () => {
  assert.match(html, /\[Short introduction\]/);
  for (const t of ['Education', 'Experience', 'Skills']) assert.match(html, new RegExp(`>${t}<`));
  assert.match(html, /\[email\]/);
  assert.match(html, /\[links\]/);
});

test('contact entries with an empty url are text, not links', () => {
  assert.doesNotMatch(html, /<a[^>]*>\s*\[email\]/);
});

test('no CV PDF link while cv.pdf is empty', () => {
  assert.doesNotMatch(html, /CV \(PDF\)/);
});

test('page has no scripts, images or motion', () => {
  assert.doesNotMatch(html, /<script/i);
  assert.doesNotMatch(html, /<img/i);
  assert.doesNotMatch(html, /transition|animation/i);
});

test('stylesheet URL carries the base path', () => {
  const links = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(m => m[1]);
  for (const l of links) assert.ok(l.startsWith('/JSCV/'), l);
});
