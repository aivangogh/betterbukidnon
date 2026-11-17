# Cutover readiness

The React application in `apps/web` is the deployable public site. The root static site is a
reference only and must not be deleted until every item below is complete.

## Completed migration scope

- All public legacy routes have an app route with localized English, Filipino, and Cebuano URLs.
- Service guides, Government, Legislative, Statistics, Transparency, Contact, News, legal pages,
  and offline/error pages are implemented in `apps/web`.
- The civic directory is app-native: 22 LGUs, 464 barangays, and their data-driven profiles.
- Dynamic profile routes are explicitly prerendered in every locale. The SEO audit verifies
  canonical links, hreflang links, sitemap membership, structured data, and unique titles.
- `public/_redirects` retains permanent mappings for legacy `.html` pages. The legacy barangay
  query URL is redirected to `/barangays/profile?code=…`, then resolved to its canonical profile.

## Remaining release gates

1. Deploy `develop` to a non-legacy preview hostname and verify the generated assets, redirects,
   language navigation, directory profiles, and offline fallback there.
2. Run a focused visual parity review at 1366, 1024, 768, and 375px for the home page, Services,
   Government, Projects, LGU directory/profile, and Barangay directory/profile.
3. Confirm external data freshness: LGU leaders, barangay leaders, contact numbers, weather, and
   social feed integration remain subject to their source-verification status.
4. Capture a recoverable archive/tag of the legacy root before removal.

## Retirement sequence

After the release gates pass, use a dedicated deletion PR:

1. Move root HTML, `assets/css`, and `assets/js` to an archived release or a `legacy` branch.
2. Remove legacy-only development commands and Playwright fixtures; keep app checks, SEO checks,
   and app visual regression coverage.
3. Retain `data/` only when it is imported by `apps/web`; retain public assets only when the build
   emits or serves them.
4. Keep the legacy URL redirect table and the query compatibility route for at least one public
   release cycle, then inspect real redirect traffic before retiring them.

Do not merge the upstream static site wholesale. Port only source-backed data or behavior into the
typed app, preserving its locale, SEO, and validation guarantees.
