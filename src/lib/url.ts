// Builds a site-internal URL that works whether the site is served from a
// sub-path (/JSCV/) or from the root of its own domain (/).
export function href(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return `${base}/${path.replace(/^\/+/, '')}`;
}
