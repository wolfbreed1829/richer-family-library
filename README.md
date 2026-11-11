# Richer Family Library

A compact family archive homepage with separate pages for photographs, writings, family history, and information about the library. Dark walnut tones, antique gold, and traditional serif type.

**Live website:** https://wolfbreed1829.github.io/richer-family-library/

## Run locally

Open `index.html` directly in a browser, or run:

```sh
npm start
```

Then open http://127.0.0.1:4187. Node 20 or later is required for the local server. There are no dependencies to install. Fonts and images are included locally.

## Files

- `index.html` — homepage
- `photographs.html` — photograph collection
- `writings.html` — written collection
- `history.html` — family history
- `about.html` — library information
- `styles.css` / `app.js` — shared appearance and mobile navigation
- `assets/` — artwork, fonts, and monogram

The archive contains no sample records. Uploads, accounts, storage, and backend services are not part of this first scaffold. The displayed library is generated illustrative artwork, not an actual family property.

## Development

```sh
node scripts/generate-pages.mjs
npm run check
```

The generator takes the shared header and footer from `index.html` and produces the four inner pages. Edit its page definitions to update those pages. There is no build step for serving the site.

## Publishing

GitHub Pages publishes the repository's `main` branch from `/`. Pushing changes to `main` updates the public website. All links use relative paths so the same files work locally and under the GitHub repository URL.

Only this website scaffold is published. Add family material intended for public viewing only; private archives will need access-controlled storage and hosting.

## Assets

The library illustration was generated with the built-in image-generation tool. The final prompt and asset details are in `assets/ARTWORK.md`. Cormorant Garamond and Source Sans 3 are bundled under their respective SIL Open Font Licenses, included in `assets/`.
