// Settings used only by the tests, so they do not depend on the real site's text.
export const site = {
  name: 'Test Person',
  tagline: 'Fixture tagline',
  about: ['Fixture about one.', 'Fixture about two.'],
  sections: [
    { id: 'alpha', title: 'Alpha Section' },
    { id: 'beta', title: 'Beta Section' },
    { id: 'empty', title: 'Empty Section' },
  ],
  cv: {
    pdf: 'cv.pdf',
    groups: [
      { title: 'Education', items: ['Fixture degree'] },
      { title: 'Skills', items: ['Fixture skill one', 'Fixture skill two'] },
    ],
  },
  contact: [
    { label: 'Plain entry', url: '' },
    { label: 'Linked entry', url: 'https://example.test/profile' },
  ],
};
