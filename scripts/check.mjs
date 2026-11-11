import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const pages = (await readdir(root)).filter(name => name.endsWith('.html'));
const errors = [];
let count = 0;
for (const name of pages) {
  const html = await readFile(resolve(root, name), 'utf8');
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
    if (/^(https?:|mailto:|data:)/.test(match[1])) continue;
    const target = match[1] === './' ? 'index.html' : match[1];
    count++;
    try { await stat(resolve(root, target)); }
    catch { errors.push(`${name}: missing ${target}`); }
  }
  if ((html.match(/<h1[ >]/g) || []).length !== 1) errors.push(`${name}: expected one h1`);
  const navigation = html.match(/<nav class="primary-nav"[\s\S]*?<\/nav>/)?.[0] || '';
  if ((navigation.match(/aria-current="page"/g) || []).length !== 1) errors.push(`${name}: current navigation missing`);
}
const css = await readFile(resolve(root, 'styles.css'), 'utf8');
for (const match of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
  count++;
  try { await stat(resolve(root, match[1])); }
  catch { errors.push(`styles.css: missing ${match[1]}`); }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else console.log(`${pages.length} pages and ${count} local references checked. No broken links or assets.`);
