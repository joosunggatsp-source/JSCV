// Arranges projects under the sections listed in the site settings.
// Kept free of Astro imports so it can be tested on its own.

type Section = { id: string; title: string };

type Item = {
  id: string;
  data: {
    title: string;
    summary: string;
    section: string;
    order: number;
    tags: string[];
    details: boolean;
  };
};

export function groupBySection<T extends Item>(
  sections: Section[],
  items: T[],
): { section: Section; items: T[] }[] {
  const known = new Set(sections.map((section) => section.id));
  for (const item of items) {
    if (!known.has(item.data.section)) {
      throw new Error(
        `Project "${item.id}" uses unknown section "${item.data.section}". ` +
          `Known sections: ${sections.map((section) => section.id).join(', ')}`,
      );
    }
  }

  return sections.map((section) => ({
    section,
    items: items
      .filter((item) => item.data.section === section.id)
      .sort(
        (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
      ),
  }));
}
