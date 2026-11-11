import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const home = await readFile(resolve(root, 'index.html'), 'utf8');
const header = home.match(/  <header[\s\S]*?<\/header>/)[0];
const footer = home.match(/  <footer[\s\S]*?<\/footer>/)[0];
const icons = {
  photographs: '<rect x="6" y="7" width="36" height="34" rx="1"/><circle cx="17" cy="17" r="3"/><path d="m7 34 10-10 8 8 7-7 10 10"/>',
  writings: '<path d="M11 5h18l8 8v30H11zM29 5v9h8M17 22h14M17 28h14M17 34h9"/>',
  history: '<path d="M24 16v9M11 25h26M11 25v7M37 25v7"/><rect x="18" y="5" width="12" height="11"/><rect x="5" y="32" width="12" height="11"/><rect x="31" y="32" width="12" height="11"/>',
  about: '<path d="M24 11C18 6 10 6 4 8v31c6-2 14-2 20 3 6-5 14-5 20-3V8c-6-2-14-2-20 3zm0 0v31"/>'
};
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
const pages = [
  { slug: 'photographs', title: 'Photographs', empty: 'No photographs added yet.', next: 'writings', nextLabel: 'Writings' },
  { slug: 'writings', title: 'Writings', empty: 'No writings added yet.', next: 'history', nextLabel: 'Family history' },
  { slug: 'history', title: 'Family history', empty: 'No family records added yet.', next: 'photographs', nextLabel: 'Photographs' },
  { slug: 'about', title: 'About the library' }
];

for (const page of pages) {
  const nav = header.replace(' aria-current="page"', '').replace(`href="${page.slug}.html"`, `href="${page.slug}.html" aria-current="page"`);
  const content = page.empty ? `
    <section class="empty-state" aria-label="Collection status">
      <svg viewBox="0 0 48 48" aria-hidden="true">${icons[page.slug]}</svg>
      <h2>${page.empty}</h2>
    </section>
    <div class="archive-bottom">
      <a class="text-link" href="./">Back to home</a>
      <a class="text-link" href="${page.next}.html">${page.nextLabel}${arrow}</a>
    </div>` : `
    <div class="about-content">
      <p>A home for the Richer family’s photographs, writings, and history.</p>
      <p>The collection is being prepared.</p>
      <div class="about-links">
        <a class="text-link" href="photographs.html">Photographs${arrow}</a>
        <a class="text-link" href="writings.html">Writings${arrow}</a>
        <a class="text-link" href="history.html">Family history${arrow}</a>
      </div>
      <p class="about-note">The library image is illustrative.</p>
    </div>`;

  await writeFile(resolve(root, `${page.slug}.html`), `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#11120f">
  <meta name="description" content="${page.title} — Richer Family Library.">
  <meta name="color-scheme" content="dark">
  <title>${page.title} | Richer Family Library</title>
  <link rel="icon" href="assets/monogram.svg" type="image/svg+xml">
  <link rel="stylesheet" href="styles.css">
  <script src="app.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
${nav}
  <main id="main" class="archive-main">
    <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Home</a><span aria-hidden="true">/</span><span aria-current="page">${page.title}</span></nav>
    <div class="page-heading">
      <div><p class="eyebrow">Richer Family Library</p><h1>${page.title}</h1></div>
      <svg class="page-emblem" viewBox="0 0 48 48" aria-hidden="true">${icons[page.slug]}</svg>
    </div>${content}
  </main>
${footer}
</body>
</html>
`);
}
console.log('Generated photographs.html, writings.html, history.html, about.html.');
