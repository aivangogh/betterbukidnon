# Architecture and migration

BetterBukidnon is a static, multi-language civic information portal for Bukidnon. The active
application is a React 19 and TypeScript 7 app built with Vite+ and TanStack Start. TanStack
Start prerenders routes to HTML; Cloudflare Workers serves the output as static assets. The app
has no application server, database, or user-account system.

## Migration status

The repository began as a fork of a static HTML site with duplicated page chrome, browser
JavaScript features, a separate Next.js app for `/services/health`, and independent build
paths. The migration consolidates the user-facing portal under `apps/web` and replaces the
standalone Next.js health page with a TanStack route.

Migration work is reviewed in incremental pull requests against the `develop` branch. Treat
the merged code on `develop` as the source of truth; an open pull request is not part of the
deployed application until merged and deployed.

Not yet migrated: the Our Projects page (`projects/`, `data/projects.json`) has no app route,
and several routes are shorter than the legacy pages they replace (FAQ, legal pages, and most
translations). See [Legacy static pages](#legacy-static-pages).

Current migration goals:

- One production frontend under `apps/web`.
- TypeScript for application code, tests, and maintained Node tooling.
- Shared React components instead of copied page chrome and browser scripts.
- Validated local JSON datasets, with source links and honest empty states for missing data.
- Static prerendering for direct navigation, accessibility, and search indexing.
- No legacy runtime or second framework in the production build.

## Technology stack

| Area              | Choice                                       | Role                                                                        |
| ----------------- | -------------------------------------------- | --------------------------------------------------------------------------- |
| Runtime           | Node.js 22+ and pnpm                         | Local development, checks, and builds                                       |
| Build tooling     | Vite+                                        | Vite build and preview, Oxlint, Oxfmt, TypeScript Go checks, and tests      |
| UI                | React 19 and TypeScript 7                    | Typed components and app code                                               |
| Routing/rendering | TanStack Start and TanStack Router           | File-based routes, static prerendering, and route-aware links               |
| Styling           | Tailwind CSS 4                               | Utility-first application styles                                            |
| Components        | Local components with a `cn()` class helper  | Accessible, composable UI; follow shadcn/ui patterns when adding primitives |
| Animation         | Motion (`motion/react`)                      | Interface transitions and animated components                               |
| Validation        | Zod                                          | Runtime validation for imported JSON content and editor input               |
| Icons             | Lucide React                                 | Consistent React icon components                                            |
| Offline support   | Workbox build and a generated service worker | Precaches the static site and handles offline navigation                    |
| Hosting           | Cloudflare Workers static assets             | Serves the prerendered output and preview deployments                       |

Vite+ provides the frontend toolchain in one place. Do not add Biome as a parallel formatter or
linter; use the repository's `vp check` workflow. TypeScript 7 is checked with TypeScript Go
through Vite+.

## Repository layout

```text
apps/
  web/
    public/                  Static public files, manifest, icons, error pages
    src/
      components/            content, engagement, i18n, layout, pwa, and services
      content/               Typed content access, schemas, translations, site metadata
      routes/                TanStack file routes
      lib/                   Shared low-level utilities
      styles.css             Tailwind entry and application theme
    vite.config.ts           Vite+, TanStack Start, Tailwind, prerender settings
    tsconfig.json
data/                        JSON content sources, validated at the app boundary
scripts/                     TypeScript maintenance and build helpers, plus legacy shell scripts
tests/                       Playwright browser tests for remaining legacy pages
docs/                         Architecture, content, deployment, and contributor guidance
wrangler.jsonc                Cloudflare static asset directory and environment routes
```

The root still holds the legacy static site (page folders such as `services/` and `faq/`,
`index.html`, `assets/`, `build.sh`). It is not deployed; see
[Legacy static pages](#legacy-static-pages).

## App structure

### Routes

Routes live in `apps/web/src/routes`. Filenames define URLs; examples include:

| Route file                  | URL                      |
| --------------------------- | ------------------------ |
| `index.tsx`                 | `/`                      |
| `services.tsx`              | `/services`              |
| `services.$category.tsx`    | `/services/:category`    |
| `service-details.$slug.tsx` | `/service-details/:slug` |
| `government.officials.tsx`  | `/government/officials`  |

The generated `routeTree.gen.ts` is maintained by TanStack tooling. Do not hand-edit it. Static
prerender configuration in `apps/web/vite.config.ts` enables link crawling and explicitly adds
data-driven service detail pages so their direct URLs exist at deployment time.

### Shared components

`components/layout/site-shell.tsx` owns the shared header, navigation, emergency banner, and
footer. Root route metadata and the document shell live in `routes/__root.tsx`. Features with
state live in focused components, such as the volunteer dialog, service search, language
switcher, and PWA update notice.

### Content and validation

Content remains in repository JSON files under `data/`. App modules in `content/` import the
data and validate it with schemas from `content/schemas.ts` before routes consume it. Keep
validation at this boundary so components receive typed, normalized values. When a dataset is
empty, show an explicit empty state and link to an authoritative source instead of filling the
page with sample or inferred public facts.

The schemas cover services, news, officials, demographics, legislative records, and fiscal
data. `content/content.test.ts` checks dataset contracts and common lookups. Contact data and
shell translations have typed modules as well.

### Localization

Locale codes are `en`, `fil`, and `ceb`, defined by the shared locale schema. The app currently
localizes shared shell labels through `content/translations.ts`; the language provider persists
selection when browser storage is available and detects supported browser preferences. Other
route content should be translated incrementally. Do not imply that every route is already
fully translated.

### Styling and UI

Tailwind CSS 4 is loaded through `@tailwindcss/vite`. Shared design tokens and global rules live
in `apps/web/src/styles.css`; component styles are expressed with Tailwind classes. Reusable
local components live under `components/`. shadcn/ui is a component pattern and generator, not a
runtime dependency: add only the primitives the app actually uses, and keep generated code
typed and accessible.

### Motion

Use Motion from `motion/react` for transitions that clarify a state change. Respect reduced
motion preferences and avoid animating essential content in a way that delays access.

## Build and deployment

The root `pnpm build` command runs the app build and then generates the Workbox service worker.
TanStack Start writes the browser deployment to `apps/web/dist/client` and a separate server
bundle to `apps/web/dist/server`; only the client directory is deployed because routes are
prerendered. `wrangler.jsonc` points Cloudflare static assets at `apps/web/dist/client`.

The client output contains the prerendered route HTML, hashed assets, web manifest, icons,
static `403.html`, `404.html`, and `500.html` fallbacks, and generated `sw.js` plus its Workbox
runtime. The post-build worker generator is TypeScript in `scripts/generate-web-sw.ts`.

Cloudflare has development, production, and branch preview environments. Domain routing and
the static asset path are configured in `wrangler.jsonc`; consult [deployment.md](deployment.md)
before changing those settings. Building does not publish or deploy the site.

## Quality checks

| Command                            | Purpose                                                       |
| ---------------------------------- | ------------------------------------------------------------- |
| `pnpm web:dev`                     | Run the app locally                                           |
| `pnpm web:check`                   | Format, lint, and type-check app files with Vite+             |
| `pnpm web:test`                    | Run app content tests                                         |
| `pnpm web:build`                   | Build and prerender the app, then generate its service worker |
| `pnpm build`                       | Production build alias used by CI and deployment              |
| `pnpm exec playwright test --list` | Check browser-test discovery                                  |

Browser tests under `tests/` still target legacy static pages during the transition. Migrate
their fixtures to the new app or replace them with route-focused tests before deleting the old
static source and its test coverage.

## Legacy static pages

The HTML pages at the repository root are the site this project forked from. Cloudflare no
longer serves them, but they remain as the reference for content that has not reached parity,
and the Playwright tests and `pnpm screenshots:mobile` still run against them. They are
removed once their routes reach parity.

While they exist, their shared skip link, hotline bar, header, and footer are generated from
templates in `scripts/chrome/`. Edit a template, then run `pnpm chrome` to rewrite every page;
`pnpm chrome:check` fails if a page differs from the templates. Do not edit between the
`<!-- chrome:name -->` markers by hand. `pnpm version:patch` (and `minor`/`major`) updates
`version.json`, `package.json`, and the version in every legacy page footer.

## Architecture decisions

- **One app instead of a separate health app:** `/services/health` used to be a standalone
  Next.js app (`react-app/`). It is now a route in the same portal, with the shared shell,
  search, localization, and deployment. A separate app would add a second build and ownership
  boundary without representing a separate product.
- **Static prerendering:** public service and government pages need stable direct links and
  should work on static hosting. Runtime server features are not enabled without a concrete
  requirement.
- **Validated JSON instead of a database:** content is versioned with the source and reviewed
  through Git. Zod detects invalid data during app loading/building.
- **Vite+ instead of a separate Biome setup:** the chosen toolchain already supplies formatter,
  linter, type checks, tests, and Vite workflows.
- **No blanket `apps/*` workspace yet:** `apps/web` is the current deployable product. Add a
  workspace package boundary when a second independently built app or shared package exists.
