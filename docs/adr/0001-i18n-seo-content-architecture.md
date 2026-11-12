# ADR 0001: Languages in the URL, a site-wide SEO layer, and a three-layer content model

- **Status:** Accepted (November 2026)
- **Scope:** `apps/web`, `data/`, `content/`, build and CI

## Context

The legacy site switched language in the browser after loading English, stored the choice in
`localStorage`, and had per-page titles, canonical links, Open Graph tags, JSON-LD, a
sitemap and `robots.txt`. The first React cutover kept the browser-side switching and lost
most of the SEO: empty page titles, one description for every page, no canonical or social
tags, no sitemap or `robots.txt` in the deployed folder, and 404s for the old `*.html` URLs.

Filipino and Cebuano versions were invisible to search engines and link previews, showed
English first on every load, and could not be shared as links. Page text was spread across
one large translations module and hard-coded components.

## Decisions

### Languages are part of the URL

- English stays at the root (`/services/health`); Filipino and Cebuano use `/fil/...` and
  `/ceb/...`. Existing English URLs do not change. Slugs stay English in every language.
- Every page is prerendered once per language, so each language version is real HTML with
  its own `<html lang>`, title and links.
- No automatic redirect by browser language: crawlers send none, and redirects hide pages
  and break shared links. The language menu links to the same page in each language.
- Interface text uses **Paraglide JS** (inlang): JSON messages per language, compiled to
  typed functions (`m.nav_home()`), loaded per page, with built-in URL localization for
  TanStack Router. Rejected: i18next (heavier runtime, string keys), Lingui (macros that fight
  the Vite+ toolchain), `i18n`/i18n-node (server middleware that reads locale files at
  runtime, which a static site cannot do), and keeping the hand-written translations module.
- Paraglide's format plugin is loaded from `node_modules`, not a CDN, so builds are
  reproducible offline.

### Framework: TanStack Router, with TanStack Start only as the prerenderer

All application code is TanStack Router (file routes, `Link`, loaders). TanStack Start is
used only to render every route and language to static HTML at build time. We do not use its
server features (server functions, request-time SSR); the deployed site is static files on
Cloudflare. A router-only single-page app was considered and rejected: it serves one
`index.html` for every URL, so link previews on Facebook and Messenger (which do not run
JavaScript) and first-pass indexing would see no per-page titles, descriptions or content.

### A site-wide SEO layer

- Every route sets its head with `seo()` (`apps/web/src/lib/seo.ts`): title "Page |
  BetterBukidnon.org", description, `robots`, canonical URL, `hreflang` links for every
  language plus `x-default`, Open Graph and Twitter cards with a 1200×630 image.
- JSON-LD: the home page describes the site as published by volunteers and _about_ the
  Provincial Government (never as the government itself), with a `SearchAction` that opens
  `/services?q=`. Every breadcrumb trail is also a `BreadcrumbList`.
- URLs have no trailing slash (Cloudflare `html_handling: drop-trailing-slash`), matching the
  legacy canonical URLs; legacy `*.html` URLs 301 to the new ones (`public/_redirects`).
- After each build, `scripts/generate-seo-files.ts` writes `sitemap.xml` (with `hreflang`
  alternates) and `robots.txt`. Only production builds (`main`) are indexable; every other
  build sends `X-Robots-Tag: noindex` so the dev site does not compete with production.
- `pnpm seo:check` validates the built pages and the sitemap in CI.

### Content lives in three layers

| Layer     | Format and place                                  | For                                                     |
| --------- | ------------------------------------------------- | ------------------------------------------------------- |
| Messages  | `apps/web/messages/{en,fil,ceb}.json`             | Interface text: navigation, buttons, labels, titles     |
| Records   | `data/*.json`, strings as `{ en, fil, ceb }`, Zod | Lists reused across pages: categories, officials …      |
| Documents | `content/<collection>/<slug>/{en,fil,ceb}.mdx`    | Pages read top to bottom: service guides, FAQ, policies |

Documents use MDX with an allowlist of block components that reproduce the legacy design.
A missing translation falls back to English. A page whose document has no translation will
not get its own alternate language URL; its canonical points to English, so search engines
do not see duplicate content.

### Repository direction

Thin routes, domain code in `src/features/<domain>/`, shared components in
`components/{layout,ui,blocks}`, helpers in `lib/{i18n,seo,content,paths}`; `content/` and
`data/` at the repository root for non-developer editors; `apps/web` becomes a pnpm workspace
package once the legacy site is removed. CI runs checks, tests, the build and `seo:check` on
every pull request.

## Consequences

- Three times as many prerendered pages (about 140). Filipino and Cebuano pages are cached by
  the service worker when visited instead of on install, so first visits stay light.
- Interface text changes go through the message files; a new message is a new key in
  `en.json` plus `m.key()` in code.
- Every new route must call `seo()`; `seo:check` fails the build otherwise.

## Plan

1. Languages in the URL and the SEO layer (this decision's first pull request).
2. MDX content layer and block components, with the PSWDO service page as the pilot.
3. Feature-folder restructure.
4. The remaining page migrations.
5. Visual baselines and end-to-end tests on the app.
6. Legacy cleanup and the workspace split.
