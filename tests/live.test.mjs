import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { buildLive } from './helpers.mjs';
import { site } from '../src/site.config.ts';

// The real site with its real content. These checks hold whatever the text
// says, so editing content never fails them; a mistake that stops the site
// from building (such as a project naming a section that does not exist) does.
let html;
before(async () => { html = (await buildLive()).read('index.html'); });

test('the real site builds and has its four parts', () => {
  for (const id of ['about', 'work', 'cv', 'contact']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
});

test('the real site shows a heading for every section in the settings', () => {
  for (const section of site.sections) {
    assert.match(html, new RegExp(`id="${section.id}"`));
  }
});

test('the real site has no scripts or motion', () => {
  assert.doesNotMatch(html, /<script/i);
  assert.doesNotMatch(html, /transition|animation/i);
});
