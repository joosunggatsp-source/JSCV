// All the text on the site except the projects lives here.
// Projects are the files in src/content/projects/. See docs/guide.md.
// Anything in [square brackets] is a placeholder waiting for real content.

export const site = {
  name: 'Joosung Lee',
  tagline: '[One-line description]',

  // One string per paragraph.
  about: ['[Short introduction]'],

  // The work sections on the home page, in the order they appear.
  // Each project file names one of these ids in its `section` field.
  sections: [
    { id: 'medical-devices', title: 'Medical Devices' },
    { id: 'automation', title: 'Automation' },
  ],

  cv: {
    // File name of a PDF placed in public/, e.g. 'cv.pdf'. Leave '' for no link.
    pdf: '',
    groups: [
      { title: 'Education', items: ['[Degree, institution, years]'] },
      { title: 'Experience', items: ['[Role, organisation, years]'] },
      { title: 'Skills', items: ['[Skill]'] },
    ],
  },

  // Leave url '' to show the label as plain text.
  contact: [
    { label: '[email]', url: '' },
    { label: '[links]', url: '' },
  ],
};
