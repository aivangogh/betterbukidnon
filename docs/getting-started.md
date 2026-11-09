# Getting Started

## Requirements

- Node.js 20 or newer (the build uses `npx`, Babel, Terser, clean-css and html-minifier)
- Python 3 (local web server)
- Git
- Optional: [Wrangler](https://developers.cloudflare.com/workers/wrangler/) for deploying
  (`npx wrangler` works without a global install)

## Run the site locally

```bash
git clone https://github.com/Better-Bukidnon/betterbukidnon.git
cd betterbukidnon
npm install
npm run dev            # http://localhost:8000
```

`npm run dev` serves the source files as they are, with no build step. Pages link to each
other with clean URLs (`/services/health`, not `/services/health.html`). Python's built-in
server doesn't resolve those, so for clicking around use the clean-URL server instead:

```bash
python3 serve.py -d .  # source files on http://localhost:8888, resolves /page to /page.html
python3 serve.py       # same for the built dist/ folder
```

## Build for production

```bash
pnpm build             # prerenders apps/web/dist/client
pnpm serve:dist        # preview the production output on http://localhost:8080
```

`pnpm build` prerenders the civic portal into `apps/web/dist/client` and generates the
service worker used by Cloudflare static-assets deployment. See
[architecture.md](architecture.md#build-pipeline) for the details.

## Tests and checks

```bash
npm run format:check   # Prettier
npm test               # Playwright (volunteer popup specs); needs browsers:
npx playwright install
npm run lighthouse     # Lighthouse CI against a running dist/ server
```

GitHub Actions runs Lighthouse CI on pushes and pull requests to `main`
(`.github/workflows/lighthouse.yml`). Accessibility must score 90 or more.

### Phone screenshots

```bash
npm run screenshots:mobile
```

Saves the first screen and the full page of every page at 320, 375 and 412 px wide to
`screenshots/` (ignored by git and left out of the build), and lists any page that scrolls
sideways. It uses your installed Google Chrome; pass `--browser=chromium` or
`--browser=firefox` to use a browser from `npx playwright install` instead. Narrow it down with
`--pages=home,services` and `--widths=375`.

For before/after images in a pull request, run it on `develop` and on your branch with
different output folders:

```bash
git switch develop && npm run screenshots:mobile -- --out=screenshots/before
git switch my-branch && npm run screenshots:mobile -- --out=screenshots/after
```

## Branches

| Branch           | Purpose                            | Deploys to                                              |
| ---------------- | ---------------------------------- | ------------------------------------------------------- |
| `main`           | Production                         | betterbukidnon.org (Worker `betterbukidnon-production`) |
| `develop`        | Integration                        | dev.betterbukidnon.org (Worker `betterbukidnon`)        |
| feature branches | Your work; open PRs into `develop` | preview URL on `*.workers.dev`                          |

See [deployment.md](deployment.md).

## Your first change

1. Read [content-guide.md](content-guide.md) for where the text you want to change lives.
2. Remember that most visible text is also in `assets/js/translations.js`. Changing only the
   HTML is not enough (see [translations.md](translations.md)).
3. Run the site, check the page in English, Filipino and Cebuano, and check it at phone width.
4. Open a pull request into `develop`.
