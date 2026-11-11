# Richer Family Library

A compact family archive homepage with separate pages for pictures, news articles, writings, family history, and information about the library. Dark walnut tones, antique gold, and traditional serif type.

**Live website:** https://wolfbreed1829.github.io/richer-family-library/

## Run locally

Open `index.html` directly in a browser, or run:

```sh
npm start
```

Then open http://127.0.0.1:4187. Node 20 or later is required for the local server. There are no dependencies to install. Fonts and images are included locally.

## Files

- `index.html` — homepage
- `photographs.html` — Pictures collection
- `news.html` — newspaper articles with publication dates and descriptions
- `last-grizzly-bear.html` — newspaper reader with page selection and enlargement
- `writings.html` — written collection
- `history.html` — family history
- `about.html` — library information
- `styles.css` / `app.js` — shared appearance and mobile navigation
- `assets/` — artwork, fonts, monogram, and original archive images
- `data/archive.json` — archive metadata and source filenames

The archive contains three personal photographs, one three-page newspaper article, and one parish-history page, all supplied by the family. Original image bytes are preserved. The newspaper was published in the *Nipawin Bridge* in September 1997; its letter dates to 1929. Undated photographs and the undated parish publication are explicitly marked as such. WhatsApp filenames are source identifiers, not historical dates.

There are no sample records. Web uploads, accounts, private storage, and backend services are not implemented. The homepage library image is generated illustrative artwork, not an actual family property.

## Development

```sh
node scripts/generate-pages.mjs
npm run check
```

The generator takes the shared header and footer from `index.html` and produces the archive pages from `data/archive.json`. Update that file to change record metadata, then regenerate. All generated HTML is committed; there is no build step for serving the site. The images and page links work when opening local files directly. JavaScript adds in-page article navigation and enlargement; without it, page links still open the original scans.

## Publishing

GitHub Pages publishes the repository's `main` branch from `/`. Pushing changes to `main` updates the public website. All links use relative paths so the same files work locally and under the GitHub repository URL.

The website and supplied archive images are published publicly. Private archives will need access-controlled storage and hosting.

## Assets

The library illustration was generated with the built-in image-generation tool. The final prompt and asset details are in `assets/ARTWORK.md`. Cormorant Garamond and Source Sans 3 are bundled under their respective SIL Open Font Licenses, included in `assets/`.
