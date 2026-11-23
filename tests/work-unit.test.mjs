import { test } from 'node:test';
import assert from 'node:assert/strict';
import { groupBySection } from '../src/lib/work.ts';

const item = (id, section, order, title = id) => ({
  id,
  data: { title, summary: '', section, order, tags: [], details: false },
});

const sections = [
  { id: 'b', title: 'B' },
  { id: 'a', title: 'A' },
];

test('groups follow settings order and sort by order then title', () => {
  const groups = groupBySection(sections, [
    item('a2', 'a', 2),
    item('a1', 'a', 1),
    item('bz', 'b', 1, 'Z'),
    item('ba', 'b', 1, 'A'),
  ]);
  assert.deepEqual(groups.map((g) => g.section.id), ['b', 'a']);
  assert.deepEqual(groups[0].items.map((i) => i.id), ['ba', 'bz']);
  assert.deepEqual(groups[1].items.map((i) => i.id), ['a1', 'a2']);
});

test('a section without items yields an empty group', () => {
  const groups = groupBySection(sections, [item('a1', 'a', 1)]);
  assert.equal(groups[0].section.id, 'b');
  assert.equal(groups[0].items.length, 0);
});

test('unknown section throws with file id and known ids', () => {
  assert.throws(
    () => groupBySection(sections, [item('x', 'nope', 1)]),
    /Project "x" uses unknown section "nope"\. Known sections: b, a/,
  );
});
