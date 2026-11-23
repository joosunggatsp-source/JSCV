import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file per project. The file name (without .md) is the project's id.
const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
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
