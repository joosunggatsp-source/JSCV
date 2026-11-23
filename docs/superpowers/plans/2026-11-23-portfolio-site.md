# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A minimal, English, structure-only portfolio site whose content Joosung can extend by editing text files and one settings file.

**Architecture:** An Astro static site. One settings file holds the site text and the list of work sections; each project is one Markdown file in a content collection. The home page is generated from both; a detail page is generated only for projects that switch it on. Tests build the site and assert on the generated HTML.

**Tech Stack:** Astro 7.4.x (Node >= 22.23.4), plain CSS, Node's built-in test runner (`node --test`), GitHub Actions + GitHub Pages. No other runtime dependencies.

**Spec:** `docs/superpowers/specs/2026-11-23-portfolio-design.md`

## Global Constraints

- Astro 7 is newer than most examples online. Before using an Astro API (content collections, `getStaticPaths`, config), check it against the installed version's docs at https://docs.astro.build, not memory.
- Generated pages contain no `<script>` tags, no `<img>` tags, and no animation or transition CSS.
- One typeface family (a system font stack; no web-font download). Near-black text on near-white, one quiet accent used only for links. Dark colours apply through `@media (prefers-color-scheme: dark)`. No theme toggle.
- One narrow text column (max width about 40rem), generous spacing, readable at 360px wide with no horizontal scroll.
- Every piece of content Joosung has not supplied is wrapped in square brackets. No invented facts. No email address anywhere in the repository's site content.
- All site text is English.
- Every internal link and asset URL is built with the base path, so the site works at `/JSCV/` and at `/`.
- Work in `/home/user/jscv` on branch `claude/optimistic-pasteur-6j3zu3`. Commit after each task and push.

## Review Focus

- A project file names a section id that is not in the settings file: the build fails with a message naming the file and the unknown id, rather than silently dropping the project. (Task 2)
- A section in the settings file has no projects: its heading still shows, followed by `[Nothing here yet]`. (Task 2)
- A project title or summary contains `<`, `&` or quotes: it appears escaped as text, not as markup. (Task 2)
- A project with the detail page switched on but an empty body: the page builds and shows the three headings Problem, What I did, Result with bracketed placeholders. (Task 3)
- The site is built for a root address (custom domain): no link or stylesheet URL still starts with `/JSCV`. (Task 4)

## File Structure

| File | Responsibility |
|---|---|
| `package.json` | Scripts `dev`, `build`, `test`; dependency `astro` only |
| `astro.config.mjs` | `site` and `base`, overridable by env `SITE_URL` and `SITE_BASE`; defaults `https://joosunggatsp-source.github.io` and `/JSCV` |
| `src/site.config.ts` | All site text except projects: name, tagline, about, sections, CV, contact |
| `src/content.config.ts` | The `projects` collection and its schema |
| `src/content/projects/*.md` | One project per file |
| `src/lib/url.ts` | `href(path)`: prefixes the base path |
| `src/lib/work.ts` | `groupBySection(sections, projects)`: ordering, validation |
| `src/layouts/Base.astro` | `<html>`, head, header nav, slot |
| `src/styles/global.css` | All styling |
| `src/pages/index.astro` | Home page |
| `src/pages/projects/[slug].astro` | Detail pages |
| `tests/helpers.mjs` | `build(env)` → runs `astro build` into a temp dir, returns `read(path)` |
| `tests/*.test.mjs` | Assertions on built HTML |
| `.github/workflows/deploy.yml` | Build and publish to Pages on push to `main` |
| `docs/guide.md`, `README.md` | How to edit content, enable Pages, connect a domain |

---

### Task 1: Scaffold, settings file, home page without work

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/site.config.ts`, `src/lib/url.ts`, `src/layouts/Base.astro`, `src/styles/global.css`, `src/pages/index.astro`, `tests/helpers.mjs`, `tests/home.test.mjs`

**Interfaces:**
- Produces: `site` exported from `src/site.config.ts`:

```ts
export const site = {
  name: 'Joosung Lee',
  tagline: '[One-line description]',
  about: ['[Short introduction]'],              // one string per paragraph
  sections: [
    { id: 'medical-devices', title: 'Medical Devices' },
    { id: 'automation', title: 'Automation' },
  ],
  cv: {
    pdf: '',                                     // file name in public/, '' = no link shown
    groups: [
      { title: 'Education', items: ['[Degree, institution, years]'] },
      { title: 'Experience', items: ['[Role, organisation, years]'] },
      { title: 'Skills', items: ['[Skill]'] },
    ],
  },
  contact: [{ label: '[email]', url: '' }, { label: '[links]', url: '' }],  // url '' = plain text
};
```

- Produces: `href(path: string): string` in `src/lib/url.ts`: joins `import.meta.env.BASE_URL` and `path` with exactly one slash between them; `href('')` returns the base with a trailing slash.
- Produces: `build(env?: Record<string,string>): Promise<{ read(path: string): string, exists(path: string): boolean }>` in `tests/helpers.mjs`: runs `npx astro build --outDir <temp dir>` with `env` merged into `process.env`, rejects with the build's stderr if it exits non-zero.
- Produces: page anchors `#about`, `#work`, `#cv`, `#contact`. `#work` wraps all work sections (filled in Task 2).

- [ ] **Step 1: Create the project.** Write `package.json` (`"type": "module"`, scripts `dev: astro dev`, `build: astro build`, `test: node --test tests/`, dependency `astro@^7.4.13`), `astro.config.mjs` as described in File Structure, `tsconfig.json` extending `astro/tsconfigs/strict`, `.gitignore` with `node_modules`, `dist`, `.astro`. Run `npm install`. Expected: exits 0, `package-lock.json` created.

- [ ] **Step 2: Write `tests/helpers.mjs`** with `build` as specified.

- [ ] **Step 3: Write the failing test `tests/home.test.mjs`**

```js
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
```

- [ ] **Step 4: Run it.** `npm test`. Expected: FAIL (no pages yet).

- [ ] **Step 5: Implement** `src/site.config.ts` (exact values above), `src/lib/url.ts`, `src/layouts/Base.astro` (props `title: string`; header with the site name linking to `href('')` and nav links About, Work, CV, Contact pointing at `href('#about')` etc.; `<html lang="en">`; viewport meta), `src/styles/global.css` (per Global Constraints), `src/pages/index.astro` (tagline, About, an empty `<div id="work">`, CV, Contact). When `cv.pdf` is non-empty show a link with text `CV (PDF)` to `href(cv.pdf)`. If Astro inlines the stylesheet so that no `<link rel="stylesheet">` exists, the last test passes vacuously; that is acceptable.

- [ ] **Step 6: Run `npm test`.** Expected: all pass.

- [ ] **Step 7: Commit and push.** Message: `Scaffold site with settings-driven home page`.

---

### Task 2: Projects collection and work sections

**Files:**
- Create: `src/content.config.ts`, `src/lib/work.ts`, `src/content/projects/artificial-valve.md`, `catheter-valve.md`, `egg-device.md`, `smart-farm-automation.md`, `factory-automation.md`, `tests/work.test.mjs`, `tests/work-unit.test.mjs`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `site.sections`, `href` from Task 1.
- Produces: collection `projects` with frontmatter schema: `title: string`, `summary: string`, `section: string`, `order: number` (default 0), `tags: string[]` (default `[]`), `details: boolean` (default `false`). The entry id is the file name without `.md`.
- Produces: in `src/lib/work.ts`, with no Astro imports so it can be unit-tested:

```ts
type Section = { id: string; title: string };
type Item = { id: string; data: { title: string; summary: string; section: string; order: number; tags: string[]; details: boolean } };
export function groupBySection(sections: Section[], items: Item[]): { section: Section; items: Item[] }[];
```

  Returns one group per section in settings order; items within a group sorted by `order` ascending, then `title`. Throws `Error` with message `Project "<id>" uses unknown section "<section>". Known sections: <ids, comma-separated>` if any item's section is not in `sections`.

- Starting content, five files, all with `details: false` and empty body:

| File | title | section | order |
|---|---|---|---|
| `artificial-valve.md` | `[Artificial Valve]` | `medical-devices` | 1 |
| `catheter-valve.md` | `[Catheter Valve]` | `medical-devices` | 2 |
| `egg-device.md` | `[EGG Device]` | `medical-devices` | 3 |
| `smart-farm-automation.md` | `[Smart Farm Automation]` | `automation` | 1 |
| `factory-automation.md` | `[Factory Automation]` | `automation` | 2 |

  Every `summary` is `[one-line summary]`.

- [ ] **Step 1: Write failing unit tests `tests/work-unit.test.mjs`** importing `../src/lib/work.ts` (Node 22 strips types natively; keep the file free of TypeScript-only syntax such as enums):
  - `groups follow settings order and sort by order then title`: sections `[b, a]`, items in `a` with orders 2, 1 and two items in `b` both order 1 titled `Z`, `A` → groups are `b: [A, Z]`, `a: [order 1, order 2]`.
  - `a section without items yields an empty group`: result has a group with `items.length === 0`.
  - `unknown section throws with file id and known ids`: `assert.throws(..., /Project "x" uses unknown section "nope"\. Known sections: a, b/)`.

- [ ] **Step 2: Write failing build tests `tests/work.test.mjs`**
  - `sections appear in settings order inside #work`: index of `Medical Devices` < index of `Automation`, both after `id="work"`.
  - `rows appear in order with summaries`: indexes of `[Artificial Valve]`, `[Catheter Valve]`, `[EGG Device]` ascending; `[Smart Farm Automation]` before `[Factory Automation]`; the string `[one-line summary]` occurs exactly 5 times.
  - `rows are not links while details is off`: `assert.doesNotMatch(html, /<a[^>]*>\s*\[Artificial Valve\]/)` and `exists('projects/artificial-valve/index.html') === false`.

- [ ] **Step 3: Run `npm test`.** Expected: new tests FAIL.

- [ ] **Step 4: Implement** `src/content.config.ts`, `src/lib/work.ts`, the five content files, and the work block in `src/pages/index.astro`: for each group an `<h2>` with the section title, then a list of rows (title, summary, tags if any); an empty group shows `[Nothing here yet]`. Text is rendered through Astro expressions so it is escaped.

- [ ] **Step 5: Run `npm test`.** Expected: all pass.

- [ ] **Step 6: Check the two build-level edge cases by hand, then revert.** (a) Temporarily change `section` in `egg-device.md` to `nope`; `npm run build` must exit non-zero and print the `unknown section "nope"` message. (b) Temporarily set a title to `A <b> & "c"`; build and confirm `dist/index.html` contains `A &lt;b&gt; &amp;`. Restore both files; `git status` shows no changes to content files.

- [ ] **Step 7: Commit and push.** Message: `Add projects collection and work sections`.

---

### Task 3: Project detail pages

**Files:**
- Create: `src/pages/projects/[slug].astro`, `tests/fixtures/details/` (see below), `tests/details.test.mjs`
- Modify: `src/pages/index.astro`, `src/content.config.ts`, `tests/helpers.mjs`

**Interfaces:**
- Consumes: `projects` collection, `groupBySection`, `href`.
- Produces: for each project with `details: true`, a page at `projects/<id>/index.html`; on the home page that project's title is a link to `href('projects/<id>/')`.
- Produces: the projects directory is overridable by env `PROJECTS_DIR` (default `src/content/projects`), read in `src/content.config.ts`, so tests can build against fixtures without editing real content.
- Fixtures in `tests/fixtures/details/`: `with-body.md` (`title: With Body`, `section: automation`, `details: true`, body containing `## Problem` and the sentence `Fixture problem text.`), `empty-body.md` (`title: Empty Body`, `section: automation`, `details: true`, no body), `off.md` (`title: Off`, `section: automation`, `details: false`).

- [ ] **Step 1: Write failing tests `tests/details.test.mjs`**, building with `{ PROJECTS_DIR: 'tests/fixtures/details' }`:
  - `page exists only when details is on`: `exists('projects/with-body/index.html')`, `exists('projects/empty-body/index.html')`, not `exists('projects/off/index.html')`.
  - `home links the title to the page`: home HTML matches `/<a[^>]*href="\/JSCV\/projects\/with-body\/"[^>]*>\s*With Body/`; `Off` is not inside a link.
  - `a written body is shown as written`: the `with-body` page contains `Fixture problem text.` and the title in an `<h1>`.
  - `an empty body shows the three headings with placeholders`: the `empty-body` page contains `Problem`, `What I did`, `Result` in that order, each followed by a bracketed placeholder (`[Describe the problem]`, `[Describe what you did]`, `[Describe the result]`).
  - `page links back to home`: both pages contain `href="/JSCV/"`.
  - `detail pages have no scripts, images or motion`: same three assertions as the home test.

- [ ] **Step 2: Run `npm test`.** Expected: new tests FAIL.

- [ ] **Step 3: Implement.** `getStaticPaths` returns only entries with `details: true`. If the entry body is empty or whitespace, render the three headings with the placeholders above; otherwise render the Markdown body. Page uses `Base.astro` with the project title, shows tags if any, and ends with a link `← Home` to `href('')`.

- [ ] **Step 4: Run `npm test`.** Expected: all pass, including Tasks 1 and 2 tests (default `PROJECTS_DIR`).

- [ ] **Step 5: Commit and push.** Message: `Add project detail pages`.

---

### Task 4: Publishing, root-address build, guide

**Files:**
- Create: `.github/workflows/deploy.yml`, `docs/guide.md`, `README.md`, `tests/root-base.test.mjs`

**Interfaces:**
- Consumes: env `SITE_URL`, `SITE_BASE` from Task 1; `PROJECTS_DIR` and fixtures from Task 3.

- [ ] **Step 1: Write failing test `tests/root-base.test.mjs`**, building with `{ SITE_URL: 'https://example.com', SITE_BASE: '/', PROJECTS_DIR: 'tests/fixtures/details' }`:
  - `no URL keeps the sub-path`: neither `index.html` nor `projects/with-body/index.html` contains `/JSCV`.
  - `links resolve at the root`: home contains `href="/#about"` and `href="/projects/with-body/"`; the detail page contains `href="/"`.

- [ ] **Step 2: Run `npm test`.** Expected: PASS if Tasks 1 to 3 built every URL through `href`; if it fails, fix the offending hard-coded path, not the test.

- [ ] **Step 3: Write `.github/workflows/deploy.yml`.** Triggers: push to `main`, and `workflow_dispatch`. Permissions `contents: read`, `pages: write`, `id-token: write`. Jobs: build (checkout, setup Node 22, `npm ci`, `npm test`, `npm run build`, upload `dist` with `actions/upload-pages-artifact`) and deploy (`actions/deploy-pages`). Check current major versions of the actions before pinning them.

- [ ] **Step 4: Write `docs/guide.md`** in English, with a short copy-paste example for each of: edit the tagline, introduction, CV entries and contact links (`src/site.config.ts`); add a CV PDF; add, remove and reorder a project; add, rename and remove a section; switch on a detail page and write its body; add an image to a project page; preview locally (`npm install`, `npm run dev`); turn on GitHub Pages (Settings → Pages → Source: GitHub Actions); connect a bought domain (set the two defaults in `astro.config.mjs` to the domain and `/`, add `public/CNAME` containing the domain, set DNS records at the registrar per GitHub's documentation, set the custom domain in Settings → Pages). State that publishing happens from `main`.

- [ ] **Step 5: Write `README.md`**: one line describing the site and a link to `docs/guide.md`.

- [ ] **Step 6: Run `npm test`.** Expected: all pass.

- [ ] **Step 7: Commit and push.** Message: `Add Pages deployment and content guide`.

---

### Task 5: Browser verification

**Files:** none committed. Scripts and screenshots go in the session scratchpad.

- [ ] **Step 1: Build twice**: default (`/JSCV`), and with `PROJECTS_DIR=tests/fixtures/details` into a second output directory.

- [ ] **Step 2: Serve each output under its base path and capture** with the pre-installed Playwright (no install): home at 1280×800 and 360×740, each in `colorScheme: 'light'` and `'dark'`; the `with-body` detail page at both widths in light.

- [ ] **Step 3: Check in the browser, not by eye alone**: at 360px `document.documentElement.scrollWidth <= window.innerWidth`; clicking each nav link scrolls its target into view; clicking the `With Body` row opens the detail page and `← Home` returns to the home page; no console errors and no failed requests.

- [ ] **Step 4: Look at the screenshots** against the spec's Look section: one column, one typeface, links are the only accented element, dark mode legible. Fix anything off in `global.css`, rerun `npm test`, recapture, commit and push.
