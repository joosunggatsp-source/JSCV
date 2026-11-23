# Site guide

Everything on the site comes from two places:

- `src/site.config.ts` holds the name, one-line description, introduction, list of work sections, CV and contact links.
- `src/content/projects/` holds one Markdown file per project.

Text in `[square brackets]` is a placeholder. Replace it when the real content is ready.

## Preview on your computer

Needs Node.js 22.23.4 or newer.

```bash
npm install
```

```bash
npm run dev
```

Open the address it prints. The page refreshes as you save files.

## Edit the text on the home page

Open `src/site.config.ts`.

```ts
tagline: 'Engineer building medical devices and automation systems',

// One string per paragraph.
about: [
  'First paragraph.',
  'Second paragraph.',
],
```

CV entries are grouped. Add a group or add lines to one:

```ts
groups: [
  { title: 'Education', items: ['B.S. in X, University Y, 2020 to 2024'] },
  { title: 'Experience', items: ['Role, Organisation, 2024 to now'] },
  { title: 'Skills', items: ['SolidWorks', 'Python'] },
],
```

Contact entries are plain text until they have a `url`:

```ts
contact: [
  { label: 'name@example.com', url: 'mailto:name@example.com' },
  { label: 'GitHub', url: 'https://github.com/your-name' },
],
```

## Add a CV PDF

Put the file in `public/`, for example `public/cv.pdf`, then set its name in `src/site.config.ts`:

```ts
cv: {
  pdf: 'cv.pdf',
```

A "CV (PDF)" link appears in the CV section.

## Add, remove or reorder a project

To add one, create a file in `src/content/projects/`. The file name becomes its address, so use lowercase letters and hyphens, for example `heart-pump.md`:

```md
---
title: "Heart Pump"
summary: "One line saying what it is."
section: medical-devices
order: 4
tags: ["CAD", "Prototype"]
details: false
---
```

- `section` must be the `id` of a section in `src/site.config.ts`. If it is not, the build stops and names the file.
- `order` sets the position within its section. Lower numbers come first.
- `tags` is optional. Use `[]` for none.

To remove a project, delete its file. To reorder, change the `order` numbers.

## Add, rename or remove a section

Edit the `sections` list in `src/site.config.ts`. They appear on the home page in this order.

```ts
sections: [
  { id: 'medical-devices', title: 'Medical Devices' },
  { id: 'automation', title: 'Automation' },
  { id: 'research', title: 'Research' },
],
```

- To rename a section, change its `title` only.
- If you change or remove an `id`, update the `section` line of every project that used it.
- A section with no projects shows "[Nothing here yet]".

## Give a project its own page

In the project's file, set `details: true`. Its title on the home page becomes a link.

With nothing below the `---` line, the page shows three headings (Problem, What I did, Result) with placeholders. Write below the line to replace them:

```md
---
title: "Heart Pump"
summary: "One line saying what it is."
section: medical-devices
order: 4
tags: []
details: true
---

## Problem

Who has this problem and why it matters.

## What I did

What you designed, built and tested.

## Result

What changed, with numbers where you have them.
```

## Add an image to a project page

Create the folder `src/assets/projects/` and put the image there. In the project file, refer to it by its path relative to that file:

```md
![Test rig on the bench](../../assets/projects/heart-pump-rig.jpg)
```

The text in square brackets describes the image for people who cannot see it. The site resizes and compresses the image when it builds.

## Save your changes to GitHub

Nothing changes on the public site until the edit is on GitHub's `main` branch. Two ways to get it there:

**In the browser (simplest).** Open the file on github.com, click the pencil icon, edit, then click "Commit changes". To add a new file, open the folder and choose Add file → Create new file (or Upload files for images and PDFs).

**From your computer.** After editing and checking with `npm run dev`:

```bash
git add -A
```

```bash
git commit -m "Update content"
```

```bash
git push
```

## Publish with GitHub Pages

The site publishes itself each time the `main` branch changes. It takes a minute or two; progress shows under the repository's Actions tab.

One-time setup, in the repository on GitHub:

1. Make sure a branch named `main` exists and is the default branch (Settings → General → Default branch).
2. Go to Settings → Pages.
3. Under "Build and deployment", set Source to "GitHub Actions".

After the next change to `main`, the site is at https://joosunggatsp-source.github.io/JSCV/.

If a publish fails, open the failed run under the Actions tab. The usual cause is a project file whose `section` does not match any section `id`; the message names the file.

## Connect your own domain

Do these in order. The last step switches the site over, so the old address keeps working until then.

1. At your domain registrar, add the DNS records GitHub lists at https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site.
2. On GitHub, go to Settings → Pages, enter the domain under "Custom domain" and save. Tick "Enforce HTTPS" once it becomes available.
3. In `astro.config.mjs`, change the two defaults and save the change to GitHub:

   ```js
   const SITE_URL = process.env.SITE_URL ?? 'https://your-domain.com';
   const SITE_BASE = process.env.SITE_BASE ?? '/';
   ```

Between steps 2 and 3 the pages may look unstyled for a few minutes. Step 3 fixes that.

## Check your changes

```bash
npm test
```

This builds the site and checks that it still comes out right. It does not depend on what your text says, so it should pass after any content edit. If it fails, the message says which file to look at.
