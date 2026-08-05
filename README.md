# hrishikesh618.github.io

Personal academic website of Hrishikesh Singh — Prime Minister's Research Fellow (PMRF) and PhD Research Scholar, Department of Water Resources Development and Management, IIT Roorkee.

Plain HTML/CSS/JS, no build step. Deployed via GitHub Pages directly from this repo.

## Structure

- `index.html` — Home
- `about.html` — About, including a "Research themes" section (id `#research-themes`)
- `publications.html` — Publications (nav: Research › Publications)
- `conferences.html` — Conferences (nav: Research › Conferences)
- `pmrf-progress.html` — PMRF Progress (nav: Research › PMRF Progress)
- `workshops.html` — Workshops and Training
- `academic-journey.html` — Academic Journey
- `gallery.html` — Gallery (Photos and Videos)
- `contact.html` — Contact
- `css/style.css` — shared stylesheet (deep navy / muted teal / light grey / muted amber palette)
- `js/main.js` — mobile navigation toggle and nav dropdowns
- `js/publications.js` — publication sorting (year / impact factor / citations)

"Research" is a nav dropdown (Publications, Conferences, PMRF Progress)
rather than a page of its own. The former `research.html` was merged into
`publications.html` as a "Research themes" section early on, then moved
again to `about.html` — About now covers who Hrishikesh is and what he
works on, while `publications.html` stays focused on the outputs.

Gallery photos and videos aren't tracked in the repo (only placeholder
`.gitkeep` files are) — see "Adding Gallery media" below.

## Local preview

No build tools required. From this folder:

```
python -m http.server 8123
```

Then open `http://localhost:8123`.

## Adding Gallery media

Drop image files in `assets/gallery/photos/` and video files in
`assets/gallery/videos/`, then add matching `<figure>` markup to
`gallery.html`'s `#gallery-photos` / `#gallery-videos` grids (see the
`.gallery-grid` rules in `css/style.css` for the expected structure —
images want roughly a 4:3 crop, videos 16:9).

## Content sourcing

All content is drawn from Hrishikesh Singh's CV, PMRF Yearly Progress Report (May 2026), and published papers. Several items are intentionally marked "not specified in source — please confirm" rather than guessed. See the source documentation in `H:\TP\Website\` (outside this repo) for the full audit trail, figure register, and location database carried over from the earlier Google Sites build.

## Outstanding items

- TRIC manuscript journal name unconfirmed (PMRF report says *Nature Cities*; Progress PPT says *Nature Communications Earth and Environment*) — site currently says "journal status to be confirmed."
- Professional headshot, Google Scholar/ORCID/LinkedIn links, and a redacted CV are not yet added.
- Conference/workshop location maps not yet built (planned as an embedded Leaflet/Google Maps widget once venue confirmations come in).
- Gallery page has no photos/videos yet — see "Adding Gallery media" above.
