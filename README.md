# Davit Khudaverdyan · games portfolio

Live: https://eternal-crave.github.io/gamedev-portfolio/

A static one-page portfolio with three games built with AI agents, each playable in the browser:

| Game | Path | Built with | Time |
|---|---|---|---|
| Scoot! | `games/scoot/` | PixiJS v8, TypeScript, Vite | 1 h to the first playable, 6 days of polish (7–16 Nov 2026) |
| Underquiet | `games/underquiet/` | JavaScript, Canvas 2D, one HTML file | 2 days (17–19 Nov 2026) |
| Peak Claim | `games/peak-claim/` | three.js, Vite | 2 h at a game jam (20 Nov 2026) |

## What is in this repo

Only the built, minified game files are published here. The games' source code lives in private repositories.

- `index.html`, `css/site.css`: the page. No build step, no framework.
- `img/`: screenshots, the favicon and the social preview image (`og.png`, 1200×630).
- `games/<name>/`: each game's production build, copied in as is.
- `.nojekyll`: tells GitHub Pages to serve the files without Jekyll.

## Updating a game

1. Build the game from its private repo (`npm run build` for the Vite games; for Underquiet, `node prototype/build_single.js`, then minify the inline script and style).
2. Check the output has no source maps (`*.map`, `sourceMappingURL`) and no keys or tokens.
3. Replace the game's folder under `games/` and commit.

## Preview locally

```
python -m http.server 8000
```

Then open http://localhost:8000.
