# Djai portfolio

Static art portfolio for Djai, a visual artist from Albay. This is the selected final one-page version of the project, with ten artwork images, a category filter, a full-image dialog and light/dark appearance.

This version has no inquiry database, booking form, payment processor or CRM backend. The older Node/SQLite studio application is a separate project and is not included here.

## Preview

Install Node.js, then run from this repository:

```powershell
node tools/serve.mjs
```

Open `http://127.0.0.1:4197`. Stop with Ctrl+C. No npm packages are required. The static files can also be served by a standard static host.

## Edit and rebuild

Edit markup in `source/body.html`, early theme setup in `source/head.html`, styles in `styles.css` and interaction code in `script.js`. Rebuild the standalone entry page with:

```powershell
node tools/prepare-assets.mjs
```

`index.html`, `styles.css`, `script.js` and `images/` are the standalone runtime files. Source templates and helpers are retained so the page is maintainable. Builder handoff output, private records, downloaded archives and delivery ZIPs are excluded from source history.

## Check the source

```powershell
node tools/prepare-assets.mjs
node tools/verify.mjs
```

The verifier creates its own ignored temporary QA directory, checks the ten-image catalog, source references and builder URL mapping, and rejects missing/unsafe media maps. It also writes ignored preview output. No existing QA folder, browser profile or source archive is required.

See [the case study](docs/CASE_STUDY.md) for the scope, verification evidence and remaining browser checks. Passing these checks does not certify accessibility or a live deployment.

## Artwork and font credits

Artwork belongs to the artist. The public portfolio use was approved for this project. `reference/asset-provenance.json` records image origins, and `reference/artwork-data.json` is the selected image catalog. DM Sans and Fraunces notices are preserved under `reference/licenses/`; embedded font data is already included in the source. This repository does not grant a new blanket license over the artwork.

## Deployment scope

This is a public source release, not evidence of a live deployment. For static hosting, serve only the four runtime paths above. The optional builder conversion uses `media-url-map.csv` and `tools/build-ghl.mjs`; it produces separate ignored output and does not upload or publish anything.

The README's commands are relative to this repository and do not depend on the original author's machine paths.
