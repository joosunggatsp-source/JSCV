# Portfolio Site Design

Date: 2026-11-23

## Intent

An English portfolio site for Joosung's work. Its main use is to show professors during graduate school applications; it may also be shown to VCs. The first version publishes only the structure of the site. Joosung fills in the details afterwards. A blog is out of scope: it will be a separate site, designed after this one.

## Decided by Joosung

- The portfolio and the blog are two separate sites, done one at a time.
- The site is as minimal as possible.
- Only the site structure is published now. Joosung adds the details later.
- Work to list: artificial valve, catheter valve, EGG device, smart farm automation, small motor-machinery factory automation.
- Audience: graduate admissions (professors), or VCs.
- Language: English.
- Joosung buys the domain.
- Repository: `joosunggatsp-source/JSCV`.

## Goals

- A reader can see the shape of the site at a glance: who this is, which areas of work exist, where the CV and contact details will be.
- Joosung can add and change content freely without touching code.
- Reads well on a phone.

## Non-goals

- Blog (next project).
- Korean version.
- Contact form, analytics, admin screen, login.
- Photos, animation, decorative elements.

## Anti-goals

- Invented results, numbers, affiliations or experience appearing on the site. Anything Joosung has not supplied stays a visible placeholder.
- Looking like a flashy pitch page. It should read as calm and serious to an admissions reader.
- Visual clutter. If an element is not needed to understand the structure, it is left out.

## Approaches

Three were considered:

1. **Plain HTML/CSS files.** Simplest to start. But the header and styles are repeated in every file, each new project means hand-editing HTML, and nothing carries over to the blog.
2. **Astro (static site generator).** One project is one text file; the output is plain HTML with no scripts. The blog can reuse the same method and styles.
3. **Next.js.** Built for apps with logins and databases; too much for a read-only portfolio.

**Chosen: 2, Astro.** Joosung spoke in terms of outcomes, so the tool was Claude's call. A minimal look does not need a minimal tool: Astro is what lets content be added by editing text files only.

## Site structure

### Home (one page)

```
Joosung Lee                          About  Work  CV  Contact

[One-line description]

About
[Short introduction]

Medical Devices
  [Artificial Valve]             [one-line summary]
  [Catheter Valve]               [one-line summary]
  [EGG Device]                   [one-line summary]

Automation
  [Smart Farm Automation]        [one-line summary]
  [Factory Automation]           [one-line summary]

CV
  [Education]  [Experience]  [Skills]      CV (PDF)

Contact
  [email]  [links]
```

- One narrow column of text with generous spacing.
- Work is a plain list of rows, not cards: title, one-line summary, optional tags.
- A row becomes a link only when that project has a detail page switched on. All detail pages are off in the first version.
- Header links jump to the sections on the same page.

### Project detail page

One page per project, when switched on. Headings in order: **Problem**, **What I did**, **Result**. Professors read "What I did"; VCs read "Problem" and "Result". A link back to home sits at the bottom.

### Look

- One typeface family. Text in near-black on near-white, with a single quiet accent used only for links.
- Light and dark follow the visitor's system setting automatically. There is no toggle button.
- No images, no animation, no JavaScript on the page.

## Content

Everything on the site that Joosung has not supplied is a placeholder wrapped in square brackets so that it is obvious on the page. That covers the one-line description, the introduction, the five project titles and summaries, CV entries, and contact links. The five project titles are literal renderings of the Korean names (for example `[Artificial Valve]`, `[EGG Device]`); Claude does not guess technical specifics.

No email address goes on the site until Joosung says which address to publish.

**Adding content freely.** Using only text files and one settings file, Joosung can:

- Add, remove or reorder projects: add or remove a file in the projects folder.
- Add, rename or remove a section: edit the list of sections in the settings file; the home page follows. The header keeps a single "Work" link that jumps to the first section. "Medical Devices" and "Automation" are only the starting values.
- Switch a project's detail page on and write its body in the same file.
- Edit the one-line description, introduction, CV entries and contact links, each in one place.
- Add images later by placing them in a set folder and naming them in a project file.

A guide in `docs/` shows each of these with an example. The top-level README holds one line about the site and a link to the guide.

## Publishing

- Deployed with GitHub Pages; pushing to the default branch builds and publishes automatically.
- Before the domain is bought: the site must work at `joosunggatsp-source.github.io/JSCV`.
- After the domain is bought: change the address in one place in the settings and add the domain file. The guide lists the steps.
- Joosung does by hand: turn on Pages in the repository settings, buy the domain and set DNS. Both are in the guide step by step.

## Verification

- The build finishes without errors.
- Opened in a real browser and captured at desktop and phone widths, in light and dark.
- Header links work. With one project's detail page temporarily switched on, the row link and the link back to home work.
- Links work both under the sub-path (`/JSCV`) and at a root address.

## Left to the builder

- The exact typeface, sizes and colour values, within the look above.
- File and folder layout.
- Exact wording of placeholders.
