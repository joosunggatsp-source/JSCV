import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { build } from './helpers.mjs';

let html;
before(async () => { html = (await build()).read('index.html'); });

const at = (text) => {
  const i = html.indexOf(text);
  assert.notEqual(i, -1, `missing: ${text}`);
  return i;
};

test('sections appear in settings order inside #work', () => {
  assert.ok(at('id="work"') < at('Alpha Section'));
  assert.ok(at('Alpha Section') < at('Beta Section'));
  assert.ok(at('Beta Section') < at('Empty Section'));
});

test('rows appear in order within their section, with summaries and tags', () => {
  assert.ok(at('Alpha Section') < at('Summary of first'));
  assert.ok(at('Summary of first') < at('Second Alpha'));
  assert.ok(at('Second Alpha') < at('Summary of second'));
  assert.ok(at('Summary of second') < at('TagOne · TagTwo'));
  assert.ok(at('TagOne · TagTwo') < at('Beta Section'));
});

test('a section with no projects shows a placeholder', () => {
  assert.match(html.slice(at('Empty Section'), at('id="cv"')), /\[Nothing here yet\]/);
});

test('titles are shown as text, not markup', () => {
  at('First &lt;b&gt; &amp; &quot;q&quot;');
  assert.doesNotMatch(html, /First <b>/);
});
