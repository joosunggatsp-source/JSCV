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

## Publish with GitHub Pages

The site publishes itself each time the `main` branch changes.

One-time setup, in the repository on GitHub:

1. Go to Settings → Pages.
2. Under "Build and deployment", set Source to "GitHub Actions".

After the next change to `main`, the site is at https://joosunggatsp-source.github.io/JSCV/. Progress shows under the Actions tab.

## Connect your own domain

1. In `astro.config.mjs`, change the two defaults:

   ```js
   const SITE_URL = process.env.SITE_URL ?? 'https://your-domain.com';
   const SITE_BASE = process.env.SITE_BASE ?? '/';
   ```

2. Create a file `public/CNAME` containing only the domain:

   ```
   your-domain.com
   ```

3. At your domain registrar, add the DNS records GitHub lists at https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site.
4. On GitHub, go to Settings → Pages, enter the domain under "Custom domain" and save. Tick "Enforce HTTPS" once it becomes available.

## Check your changes

```bash
npm test
```

This builds the site and checks that the pages and links come out as expected.
