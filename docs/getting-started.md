# Getting started

## Requirements

- Node.js 22.18+, 24.11+ or 26+ (see `engines` in `package.json`)
- pnpm 11 or newer (Corepack is recommended)
- Git
- Python 3 for `pnpm serve:dist` and the Playwright test server

## Install and run

```bash
git clone https://github.com/Better-Bukidnon/betterbukidnon.git
cd betterbukidnon
corepack enable
pnpm install
pnpm web:dev
```

The Vite development server prints its local URL. The current React app lives in `apps/web`;
run its scripts from the repository root so it uses the shared dependency installation.

## Build and preview

```bash
pnpm web:check
pnpm web:test
pnpm build
pnpm serve:dist
```

`pnpm build` writes the Cloudflare static site to `apps/web/dist/client`. It prerenders routes
and generates the service worker. `pnpm serve:dist` serves those generated files on port 8080.
Use `wrangler.jsonc` as the source of truth for the deployed static directory and environment
routes.

## Repository commands

| Command                             | Purpose                                                        |
| ----------------------------------- | -------------------------------------------------------------- |
| `pnpm web:dev`                      | Start the app development server                               |
| `pnpm web:check`                    | Run app formatting, lint, and TypeScript checks                |
| `pnpm web:test`                     | Run content contract tests                                     |
| `pnpm web:build`                    | Build, prerender, and generate the service worker              |
| `pnpm build`                        | Production build entry point                                   |
| `pnpm version:check`                | Print current project version without changing it              |
| `pnpm test`                         | Run the Playwright browser tests (legacy pages)                |
| `pnpm lighthouse`                   | Run Lighthouse CI against a running `pnpm serve:dist`          |
| `pnpm screenshots:mobile`           | Phone-size screenshots of the legacy pages                     |
| `pnpm chrome` / `pnpm chrome:check` | Regenerate or check the legacy pages' shared header and footer |

## Migration and contribution workflow

The application is migrating in reviewed stages from the fork's static HTML and JavaScript to
TypeScript React modules. The legacy pages stay in the repository until their routes reach
parity; see [architecture.md](architecture.md#legacy-static-pages).

For a new feature, prefer this sequence:

1. Put a route in `apps/web/src/routes` and reusable components under `apps/web/src/components`.
2. Keep data access and validation in `apps/web/src/content`; validate JSON at the boundary.
3. Use shared route links, localization, and layout components rather than duplicating them.
4. Run `pnpm web:check`, `pnpm web:test`, and `pnpm build` for app or deployment changes.
5. Open a pull request into `develop` and describe any content sources or verification limits.

See [architecture.md](architecture.md), [content-guide.md](content-guide.md), and
[deployment.md](deployment.md) for more detail.

## Tests and checks

The Playwright tests need browsers the first time:

```bash
pnpm exec playwright install
pnpm test
```

GitHub Actions runs Lighthouse CI on pushes and pull requests to `main`
(`.github/workflows/lighthouse.yml`). Accessibility must score 90 or more.

### Phone screenshots

```bash
pnpm screenshots:mobile
```

Saves the first screen and the full page of every legacy page at 320, 375 and 412 px wide to
`screenshots/` (ignored by git) and lists any page that scrolls sideways. It uses your
installed Google Chrome; pass `--browser=chromium` or `--browser=firefox` to use a browser
from `pnpm exec playwright install` instead. Narrow it down with `--pages=home,services` and
`--widths=375`.

For before/after images in a pull request, run it on `develop` and on your branch with
different output folders:

```bash
git switch develop && pnpm screenshots:mobile -- --out=screenshots/before
git switch my-branch && pnpm screenshots:mobile -- --out=screenshots/after
```

## Branches

| Branch           | Purpose                            | Deploys to                                              |
| ---------------- | ---------------------------------- | ------------------------------------------------------- |
| `main`           | Production                         | betterbukidnon.org (Worker `betterbukidnon-production`) |
| `develop`        | Integration                        | dev.betterbukidnon.org (Worker `betterbukidnon`)        |
| feature branches | Your work; open PRs into `develop` | preview URL on `*.workers.dev`                          |

See [deployment.md](deployment.md).
