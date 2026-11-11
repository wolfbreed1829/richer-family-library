import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const home = await readFile(resolve(root, 'index.html'), 'utf8');
const header = home.match(/  <header[\s\S]*?<\/header>/)[0];
const footer = home.match(/  <footer[\s\S]*?<\/footer>/)[0];
const archive = JSON.parse(await readFile(resolve(root, 'data/archive.json'), 'utf8'));
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const icons = {
  photographs: '<rect x="6" y="7" width="36" height="34" rx="1"/><circle cx="17" cy="17" r="3"/><path d="m7 34 10-10 8 8 7-7 10 10"/>',
  news: '<path d="M8 6h33v34a3 3 0 0 1-3 3H9a4 4 0 0 1-4-4V15h3m0-9v33c0 3 3 4 5 4M14 13h21M14 19h21M26 26h9M26 32h9"/><path d="M14 26h7v10h-7z"/>',
  writings: '<path d="M11 5h18l8 8v30H11zM29 5v9h8M17 22h14M17 28h14M17 34h9"/>',
  history: '<path d="M24 16v9M11 25h26M11 25v7M37 25v7"/><rect x="18" y="5" width="12" height="11"/><rect x="5" y="32" width="12" height="11"/><rect x="31" y="32" width="12" height="11"/>',
  about: '<path d="M24 11C18 6 10 6 4 8v31c6-2 14-2 20 3 6-5 14-5 20-3V8c-6-2-14-2-20 3zm0 0v31"/>'
};
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
const dateMarkup = item => item.date ? `<time datetime="${escape(item.date)}">${escape(item.dateLabel)}</time>` : escape(item.dateLabel);
const originalLink = (image, label = 'View full size') => `<a class="text-link" href="${escape(image)}" target="_blank" rel="noopener">${escape(label)}${arrow}<span class="visually-hidden"> (opens in a new tab)</span></a>`;

function picturesContent() {
  return `<div class="picture-grid">${archive.pictures.map(picture => `
      <figure class="picture-card">
        <a class="picture-image" href="${escape(picture.image)}" target="_blank" rel="noopener" aria-label="${escape(picture.title)} — view full size (opens in a new tab)">
          <img src="${escape(picture.image)}" alt="${escape(picture.alt)}" style="object-position:${escape(picture.position)}" loading="lazy">
        </a>
        <figcaption><h2>${escape(picture.title)}</h2><p class="record-date">${dateMarkup(picture)}</p>${originalLink(picture.image)}</figcaption>
      </figure>`).join('')}
    </div>`;
}

function newsContent() {
  return `<div class="record-list">${archive.news.map(article => `
      <article class="record-card">
        <a class="record-image" href="${escape(article.id)}.html" aria-label="Read ${escape(article.title)}"><img src="${escape(article.pages[0].image)}" alt="${escape(article.pages[0].alt)}" loading="lazy"></a>
        <div class="record-body">
          <p class="record-date">${dateMarkup(article)} <span aria-hidden="true">·</span> ${escape(article.publication)}</p>
          <h2><a href="${escape(article.id)}.html">${escape(article.title)}</a></h2>
          <p class="record-description">${escape(article.description)}</p>
          <p class="record-detail">Pages ${escape(article.pageRange)}</p>
          <a class="button button-outline" href="${escape(article.id)}.html">Read article${arrow}</a>
        </div>
      </article>`).join('')}
    </div>`;
}

function historyContent() {
  return `<div class="record-list">${archive.history.map(record => `
      <article class="record-card">
        <a class="record-image" href="${escape(record.image)}" target="_blank" rel="noopener" aria-label="${escape(record.title)} — view full size (opens in a new tab)"><img src="${escape(record.image)}" alt="${escape(record.alt)}" loading="lazy"></a>
        <div class="record-body">
          <p class="record-date">${dateMarkup(record)}</p>
          <h2>${escape(record.title)}</h2>
          <p class="record-description">${escape(record.description)}</p>
          <p class="record-detail">Parish souvenir · Page ${escape(record.page)}</p>
          ${originalLink(record.image)}
        </div>
      </article>`).join('')}
    </div>`;
}

function articleContent(article) {
  return `
    <div class="article-summary">
      <p class="record-date">${dateMarkup(article)} <span aria-hidden="true">·</span> ${escape(article.publication)} <span aria-hidden="true">·</span> Pages ${escape(article.pageRange)}</p>
      <p class="record-description">${escape(article.description)}</p>
    </div>
    <section class="document-reader" aria-label="Newspaper article">
      <div class="reader-toolbar">
        <nav class="scan-pages" aria-label="Article pages">${article.pages.map((scan, index) => `
          <a href="${escape(scan.image)}" data-scan data-page="${scan.number}" data-alt="${escape(scan.alt)}"${index === 0 ? ' aria-current="page"' : ''}>Page ${scan.number}</a>`).join('')}
        </nav>
        <button class="zoom-button" type="button" aria-pressed="false" aria-controls="scan-viewport">Enlarge</button>
      </div>
      <p class="visually-hidden" id="scan-status" aria-live="polite">Showing newspaper page ${article.pages[0].number}</p>
      <div id="scan-viewport" class="scan-viewport" tabindex="0" role="region" aria-label="Article scan. Use the arrow keys to scroll when enlarged.">
        <img id="article-scan" src="${escape(article.pages[0].image)}" alt="${escape(article.pages[0].alt)}">
      </div>
      <div class="reader-bottom"><a id="scan-original" class="text-link" href="${escape(article.pages[0].image)}" target="_blank" rel="noopener">Open original${arrow}<span class="visually-hidden"> (opens in a new tab)</span></a><a class="text-link" href="news.html">Back to news articles</a></div>
    </section>`;
}

const pages = [
  { slug: 'photographs', title: 'Pictures', content: picturesContent() },
  { slug: 'news', title: 'News articles', content: newsContent() },
  { slug: 'writings', title: 'Writings', empty: 'No writings added yet.', next: 'history', nextLabel: 'Family history' },
  { slug: 'history', title: 'Family history', content: historyContent() },
  { slug: 'about', title: 'About the library' },
  ...archive.news.map(article => ({ slug: article.id, navSlug: 'news', title: article.title, description: article.description, content: articleContent(article) }))
];

for (const page of pages) {
  const navSlug = page.navSlug || page.slug;
  const nav = header.replace(' aria-current="page"', '').replace(`href="${navSlug}.html"`, `href="${navSlug}.html" aria-current="page"`);
  const content = page.content || (page.empty ? `
    <section class="empty-state" aria-label="Collection status">
      <svg viewBox="0 0 48 48" aria-hidden="true">${icons[page.slug]}</svg>
      <h2>${page.empty}</h2>
    </section>
    <div class="archive-bottom">
      <a class="text-link" href="./">Back to home</a>
      <a class="text-link" href="${page.next}.html">${page.nextLabel}${arrow}</a>
    </div>` : `
    <div class="about-content">
      <p>A home for the Richer family’s photographs, writings, newspaper articles, and history.</p>
      <div class="about-links">
        <a class="text-link" href="photographs.html">Pictures${arrow}</a>
        <a class="text-link" href="news.html">News articles${arrow}</a>
        <a class="text-link" href="writings.html">Writings${arrow}</a>
        <a class="text-link" href="history.html">Family history${arrow}</a>
      </div>
      <p class="about-note">The library image is illustrative.</p>
    </div>`);

  await writeFile(resolve(root, `${page.slug}.html`), `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#11120f">
  <meta name="description" content="${escape(page.description || `${page.title} — Richer Family Library.`)}">
  <meta name="color-scheme" content="dark">
  <title>${escape(page.title)} | Richer Family Library</title>
  <link rel="icon" href="assets/monogram.svg" type="image/svg+xml">
  <link rel="stylesheet" href="styles.css">
  <script src="app.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
${nav}
  <main id="main" class="archive-main${page.navSlug ? ' article-main' : ''}">
    <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Home</a><span aria-hidden="true">/</span>${page.navSlug ? '<a href="news.html">News articles</a><span aria-hidden="true">/</span>' : ''}<span aria-current="page">${escape(page.title)}</span></nav>
    <div class="page-heading">
      <div><p class="eyebrow">Richer Family Library</p><h1>${escape(page.title)}</h1></div>
      <svg class="page-emblem" viewBox="0 0 48 48" aria-hidden="true">${icons[navSlug]}</svg>
    </div>${content}
  </main>
${footer}
</body>
</html>
`);
}
console.log(`Generated ${pages.length} archive pages from data/archive.json.`);
