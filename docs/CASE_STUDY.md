# Djai static portfolio case study

## Purpose and scope

Present a visual artist's paintings, murals, wearable pieces and art objects through a one-page portfolio. This source release selects the final static version and preserves the artist's image credits and embedded font notices. It is separate from an earlier Node/SQLite inbox application.

The page has ten artwork files, category filters, a modal image viewer with previous/next controls, light/dark appearance, remembered theme choice and motion preferences. Contact links lead to the artist's real external destinations. There is no simulated booking success, database, payment form or CRM integration in this version.

## Engineering choices

- Keep the runtime to HTML, CSS, JavaScript and local image files; no npm installation is needed to preview it.
- Retain editable head/body templates and a deterministic entry-page builder so the generated page is not the only source.
- Keep a compact image catalog and provenance record alongside the ten selected assets, including font license files.
- Separate optional website-builder snippets from standalone hosting. The media-map conversion validates URLs and writes ignored output rather than publishing anything.
- Keep the older server application, private data, raw downloads, QA dumps and delivery ZIPs out of the public source package.

## Verification on 9 November 2026

The first run from the selected clean source exposed a real setup defect: `tools/verify.mjs` attempted to create a scratch directory inside a nonexistent ignored `qa` directory. The verifier now creates that parent and checks that cleanup remains inside it.

The next run exposed a stale test assumption: the missing-media test used the real, already-filled media map and expected a failure. It now creates its own explicitly empty map, so the test does not depend on the author's current deployment configuration.

The existing source checks cover catalog size/category counts, one-page scope, gallery captions, local image paths, CSV parsing, required URL maps, mapped runtime image sources and unsafe/duplicate/unknown map entries. Static inspection also checked anchor IDs, local asset references and JavaScript syntax.

Browser automation stopped because Computer Use could not confidently verify the Windows browser URL. Therefore phone/desktop rendering, actual keyboard focus, modal interactions, theme persistence and reduced-motion behavior were **not verified in this session**. Existing code for those behaviors is implementation evidence, not proof of a passing browser test. No visual/accessibility certification or live deployment is claimed.

## Remaining release checks

Run the local preview and check widths around 390, 768 and 1440 pixels. Exercise the menu, category filters, image viewer, Escape/arrow/Tab handling, focus restoration, both themes and the device's reduced-motion setting. Confirm external contact destinations and the actual host's asset URLs. Record real results before claiming these checks passed.

## Attribution

Artwork is the artist's work. Public portfolio use was approved for this project; it does not grant a new blanket license to reuse all images. See `reference/asset-provenance.json` and `reference/licenses/` for the retained source records and font terms.
