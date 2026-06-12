# karan-portfolio

Personal portfolio and landing page for **Karan Narula** — engineer & CTO of [Audible Sight](https://audiblesight.ai).

A zero-dependency static site: plain HTML, CSS, and vanilla JavaScript. No build step, no framework, nothing to install.

## Features

- **Multi-page navigation** via hash routing (`#/about`, `#/work`, etc.) — shareable URLs, working back/forward, all in one HTML file
- **Dark mode** — follows system preference, toggleable, remembered via `localStorage`
- **Wordle-style tile reveal** on the homepage name
- **A playable Connections-style puzzle** as the "about me" section (`js/main.js`)
- **Accessible by design** — semantic landmarks, skip link, visible focus states, `aria-live` game feedback, and full `prefers-reduced-motion` support

## Structure

```
.
├── index.html          # all pages (shown/hidden by the router)
├── css/style.css       # theme variables (light + dark), layout, components
├── js/main.js          # theme toggle, hash router, puzzle logic
└── assets/             # resume PDF
```

## Run locally

It's a static site — open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Deploy to GitHub Pages

1. Push this repo to GitHub
2. **Settings → Pages → Source:** select `Deploy from a branch`, branch `main`, folder `/ (root)`
3. The site goes live at `https://<username>.github.io/karan-portfolio/`

## Customize

- **Theme colors:** edit the CSS variables at the top of `css/style.css` (`:root` for light, `[data-theme="dark"]` for dark)
- **Puzzle content:** edit the `GROUPS` array in `js/main.js`
- **Pages:** each page is a `<div class="page" id="page-NAME">` in `index.html`; register new ones in the `PAGES` array in `js/main.js`
