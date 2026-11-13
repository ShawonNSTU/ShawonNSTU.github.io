# Shaon Kanti Dhar · Portfolio

Personal portfolio, served by GitHub Pages. Plain HTML, CSS and JavaScript, with no build step.

## Where things live

| To change | Edit |
|---|---|
| Any text: projects, jobs, awards, news, skills | `data/content.js` |
| Colors, fonts, spacing | `assets/css/styles.css` (tokens at the top, in `:root`) |
| Page layouts and behaviour | `assets/js/app.js` (one `v…()` function per page) |
| Images | `assets/img/` (WebP, about 1400px wide at most) |
| Page title and meta description | `index.html` |

## Common edits

- **Add a news item:** add a `['Mon YYYY','What happened.']` line at the top of `NEWS`.
- **Add an award:** add an object to `AWARDS` and put its image in `assets/img/`.
- **Add a case study:** copy an object in `PROJECTS` and give it a new `id`. Its page is then at `/#<id>`. The home page's featured-projects panel and the Work page list every project, in order.
- **Add a small project:** add an object to `ARCHIVE`.

## Pages

`#home`, `#about`, `#work`, `#research`, `#record`, `#recognition`, `#contact`, plus one page per project id.

## Run locally

Open `index.html` in a browser, or run `python3 -m http.server` and visit http://localhost:8000.

## After an edit

Bump the `?v=` number on the three file links in `index.html`, so visitors' browsers load the new files instead of cached copies.

## Visitor stats

GoatCounter counts every page view: https://shaonkantidhar.goatcounter.com
Each page is counted separately (`/`, `/cv`, `/research`, `/quality-agent`, …).
To see which email led to a visit, share links like `https://shawonnstu.github.io/?ref=edinburgh`; the tag shows under Referrers.

## Chat assistant

The "Ask AI" panel answers questions about the portfolio. It works on its own with built-in answers, and can use a free open model through a small Cloudflare Worker. See `chatbot/README.md`.
