import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Tests point PROJECTS_DIR at fixture files; the site itself always uses the default.
const projectsDir = process.env.PROJECTS_DIR ?? './src/content/projects';

// One Markdown file per project. The file name (without .md) is the project's id.
const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: projectsDir }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    // Must match the id of a section in src/site.config.ts.
    section: z.string(),
    // Lower numbers come first within a section.
    order: z.number().default(0),
    tags: z.array(z.string()).default([]),
    // true gives the project its own page and makes its row a link.
    details: z.boolean().default(false),
  }),
});

export const collections = { projects };
