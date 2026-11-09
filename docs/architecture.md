# Architecture

BetterBukidnon is a **static civic portal** built with Vite+, React 19, TypeScript, TanStack
Start, Tailwind CSS, and JSON content contracts. There is no runtime server or database.
TanStack Start prerenders the portal and Cloudflare Workers serves the static assets.

## Directory layout

```
/
├── index.html                 Homepage
├── services/                  Service category pages (agriculture, business, certificates, …)
├── service-details/           One page per office or document (provincial-treasurer, pswdo, …)
├── government/                Provincial Government overview (index) and officials list
├── statistics/                Population, land area, LGU table, charts
├── legislative/               Sangguniang Panlalawigan + ordinance/resolution process pages
├── budget/                    Transparency: budget, SRE, DPWH projects
├── news/                      Curated updates (data/news.json)
├── contact/ faq/ terms/ privacy/ accessibility/ sitemap/
├── 403.html 404.html 500.html offline.html
├── assets/
│   ├── css/                   style.css (main), responsive, accessibility, footer, page-specific
│   ├── js/                    One script per feature (see below)
│   ├── images/logo/           better-bukidnon-logo(-white).svg, favicon.svg/.ico, partner logos
│   ├── images/banners/        opengraph.png (social preview, 1200×630)
│   └── animation/             Lottie JSON used by homepage call-to-action sections
├── data/                      JSON content loaded by the page scripts
├── react-app/                 Next.js app; only /services/health ships to production
├── admin/news-editor.html     Local-only tool for editing data/news.json (not deployed)
├── scripts/                   Build, version and maintenance scripts (not deployed)
├── tests/                     Playwright specs
├── docs/                      This documentation (not deployed)
├── .claude/agents/            Claude Code subagents for contributors (see claude-code.md)
├── build.sh                   Production build → dist/
├── wrangler.jsonc             Cloudflare Workers config (development + production)
├── sw.js, manifest.webmanifest  Progressive Web App support
└── .htaccess, serve.py        Legacy Apache/cPanel config and a local clean-URL server
```

## Pages

Every page is a complete HTML document. The page chrome is **copied into each page** rather
than included from a template:

1. Hotline bar (emergency numbers)
2. Header with logo, navigation and the EN / FIL / CEB language buttons
3. Real-time info bar (exchange rate, Malaybalay weather, Philippine time)
4. Page content (`<main id="main-content">`)
5. Footer (tagline, links, resources, "Cost to the People of Bukidnon = ₱0", partners, version)
6. Volunteer popup markup (homepage)

Because the chrome is duplicated, a change to the hotline bar or footer has to be made in
every HTML file. Do it with a script (find/replace across `*.html`) and check the result with
`git diff`. The hotline numbers live in [bukidnon-facts.md](bukidnon-facts.md); keep them in
sync.

Links use clean URLs (`/services/health`, `/service-details/pswdo`). Cloudflare's
`html_handling: auto-trailing-slash` maps them to the `.html` files, and `serve.py` does the
same locally.

## JavaScript

All scripts are plain browser JavaScript loaded with `defer`. No bundler.

| Script                                                        | Used on        | What it does                                                                                                              |
| ------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `translations.js`                                             | every page     | Dictionaries for `en`, `fil`, `ceb` and the `TranslationEngine` that applies them. See [translations.md](translations.md) |
| `main.js`                                                     | every page     | Navigation, dropdowns, mobile menu, shared UI behaviour                                                                   |
| `info-bar.js`                                                 | every page     | Exchange rates (open.er-api.com), weather (Open-Meteo, Malaybalay coordinates), PH time                                   |
| `version.js`                                                  | every page     | Shows the site version from `version.json`                                                                                |
| `search.js`                                                   | home, services | Service search and autocomplete                                                                                           |
| `weather-map.js`                                              | home           | Weather widget and the OpenStreetMap / Leaflet map                                                                        |
| `news.js`                                                     | home, news     | Renders `data/news.json`                                                                                                  |
| `fb-feed.js`                                                  | home           | Facebook page feed embed helpers                                                                                          |
| `volunteer-popup.js`                                          | home           | Volunteer recruitment dialog                                                                                              |
| `officials.js`                                                | government     | Renders `data/officials.json`                                                                                             |
| `statistics-new.js`                                           | statistics     | Charts (Chart.js) and animated counters from `data/demographics.json`                                                     |
| `ordinances.js`, `resolutions.js`                             | legislative    | Render `data/ordinances.json`, `data/resolutions.json`                                                                    |
| `transparency-v2.js`, `dpwh-projects.js`                      | budget         | Render fiscal data and DPWH projects                                                                                      |
| `transparency.js`, `transparency-2025.js`, `sre-formatter.js` | none           | Unused legacy scripts from the template, kept for reference; their Solano figures were removed                            |
| `services-validator.js`, `validation-utils.js`                | services       | Validate `data/services.json` entries                                                                                     |

## Data files

| File                                            | Content                                                             | Status                          |
| ----------------------------------------------- | ------------------------------------------------------------------- | ------------------------------- |
| `data/officials.json`                           | Governor, Vice Governor, Board Members, representatives (2025–2028) | Filled                          |
| `data/demographics.json`                        | Province and per-LGU population, area, barangays                    | Filled                          |
| `data/services.json`                            | Service directory used by search                                    | Filled                          |
| `data/competitive-index.json`                   | DTI CMCI scores                                                     | Empty, links to cmci.dti.gov.ph |
| `data/ordinances.json`, `data/resolutions.json` | Sangguniang Panlalawigan records                                    | Empty                           |
| `data/fiscal_transparency.json`                 | Budget and SRE                                                      | Empty                           |
| `data/dpwh-projects.json`                       | DPWH projects in Bukidnon                                           | Empty                           |
| `data/news.json`                                | Curated news items                                                  | Empty until curated             |

Pages must keep working when a data file is empty: they show an empty state that links to
the official source. See [content-guide.md](content-guide.md) for how to fill them.

## React app (`react-app/`)

A Next.js 14 + TypeScript app with its own header, footer, hotline bar and language context
(`src/contexts/LanguageContext.tsx`). It is exported statically (`react-app/out/`). The build
copies only `out/_next/` and `out/services/health.html` into `dist/`, so in production
`/services/health` is the React page and everything else is the static site. When you change
shared chrome (hotlines, footer links, languages), change it in the React components too.

## Build pipeline

`build.sh` (run by `npm run build`):

0. Loads `.env` if present (`SITE_URL`, see `.env.example`)
1. Bumps the version (`scripts/bump-version.js` updates `version.json`, `package.json`, the
   version shown in every page footer and `react-app/public/version.json`)
2. Cleans `dist/`
3. Copies the site into `dist/` with `rsync` (or `scripts/copy-dist.js` on Windows), leaving
   out `docs/`, `scripts/`, `tests/`, `admin/`, `react-app/`, `node_modules/`, Markdown files
   and config files
4. Builds the React app and merges `/services/health`
5. Minifies HTML (html-minifier-terser), CSS (clean-css) and JS (Babel + Terser)
6. Sets file permissions (a cPanel leftover; harmless on Cloudflare)

## Progressive Web App

`manifest.webmanifest` makes the site installable. `sw.js` precaches the core pages and
assets and serves `offline.html` when the network is down. When you add, rename or delete a
page that is in the precache list, update `PRECACHE_URLS` and bump `CACHE_VERSION` in `sw.js`
so browsers drop the old cache.

## Third-party services

| Service                       | Purpose                                   | Data sent               |
| ----------------------------- | ----------------------------------------- | ----------------------- |
| Open-Meteo                    | Weather                                   | Malaybalay coordinates  |
| open.er-api.com               | Exchange rates                            | none                    |
| OpenStreetMap                 | Map tiles and embed                       | map viewport            |
| Facebook page plugin          | Latest updates feed                       | standard Facebook embed |
| jsDelivr, unpkg, Google Fonts | Icons, Leaflet, Lottie player, Inter font | standard CDN requests   |

There is no analytics script. The upstream template's Google Analytics tag was removed.
