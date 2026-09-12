# Tianxing Chen homepage — local clone

This folder contains a local-only reproduction of:

https://tianxingchen.github.io/

The WeChat QR-code button is intentionally omitted. All other page content,
interactive sections, media previews, and destination links are preserved.

## Preview locally

From this folder, run:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Then open:

http://127.0.0.1:4173/

The server is bound to the local computer only. It does not publish the page.

## Main files

- `index.html` — page content, links, and interactions
- `style.css` — complete page styling and responsive rules
- `scripts/build-local-clone.mjs` — rebuilds the local clone from the saved
  reference source while removing the WeChat QR button
- `scripts/validate-clone.mjs` — checks that all other links remain intact

Images and videos keep their original public URLs so the local page remains
visually identical without duplicating a large media archive. An internet
connection is required for those remote media assets.
