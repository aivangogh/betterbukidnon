# Content Guide

How to change what the site says. Read [translations.md](translations.md) first: most visible
text exists twice, once in the HTML and once in `assets/js/translations.js`, and the dictionary
wins.

Before changing a fact (a name, a number, a date), update
[bukidnon-facts.md](bukidnon-facts.md) with the new value and its source. Then update the
pages listed below.

## Where things live

| What                                                    | Where                                                                                                                                            |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Emergency hotline bar                                   | `scripts/chrome/hotline.html` (then `npm run chrome`), plus `react-app/src/components/layout/HotlineBar.tsx`                                     |
| Header, navigation and footer                           | `scripts/chrome/header.html`, `footer.html` (then `npm run chrome`), plus the React `Header.tsx` and `Footer.tsx`                                |
| Homepage                                                | `apps/web/src/components/home/` and the `home-*` keys in `apps/web/src/content/translations.ts`                                                  |
| Governor, Vice Governor, Board Members, representatives | `data/officials.json` (rendered by `assets/js/officials.js`) and the cards in `government/index.html` and `index.html`                           |
| Cities, municipalities and districts                    | `government/index.html` (section `#lgus`) and `data/demographics.json`                                                                           |
| Population and area                                     | `data/demographics.json`, the homepage stat cards, `statistics/index.html`                                                                       |
| Service categories                                      | `data/service-categories.json` (each `/services/<id>` page, in EN, FIL and CEB); the directory cards in `apps/web/src/routes/services/index.tsx` |
| Office pages and document guides                        | `service-details/*.html`                                                                                                                         |
| Search results                                          | `data/services.json` (titles, keywords, offices) and the engine in `apps/web/src/content/search.ts`                                              |
| Capitol directory                                       | `contact/index.html`                                                                                                                             |
| Ordinances and resolutions                              | `data/ordinances.json`, `data/resolutions.json`                                                                                                  |
| Budget, SRE and DPWH projects                           | `data/fiscal_transparency.json`, `data/dpwh-projects.json`                                                                                       |
| News                                                    | `data/news.json` (see [news-curation.md](news-curation.md))                                                                                      |
| Our Projects page and nav dropdown                      | `data/projects.json` (validated in `apps/web/src/content/projects.ts`), the "Our Projects" dropdown in `apps/web/src/content/navigation.ts`      |
| Sitemap                                                 | `sitemap.xml` and `sitemap/index.html`                                                                                                           |

## Common tasks

### Officials change (election, succession)

1. Update section 3 of [bukidnon-facts.md](bukidnon-facts.md) with the source.
2. Edit `data/officials.json`.
3. Update the Governor and Vice Governor cards on the homepage (`index.html`, section
   "Provincial Leadership") and on `government/index.html`.
4. Search for the old names across the repo, `react-app/` included:
   `grep -rn "Old Name" --include=*.html --include=*.js --include=*.json .`

### A hotline number changes

The hotline bar is generated from one template. Edit the number in
`scripts/chrome/hotline.html`, then copy it into every page and check the diff:

```bash
npm run chrome
git diff --stat
```

Also update `react-app/src/components/layout/HotlineBar.tsx`, `contact/index.html` and
[bukidnon-facts.md](bukidnon-facts.md).

### Change a service category page

Each `/services/<id>` page comes from `data/service-categories.json`: the header, the contact
strip, the card sections and the closing note. Every piece of text has `en`, and `fil` and
`ceb` where a translation exists; a missing translation shows the English text. Links are app
paths (`/service-details/pswdo`), `tel:` numbers, or `https://` URLs, which open in a new tab.
`pnpm web:test` fails if a link points to a page that does not exist or an icon is not in
Bootstrap Icons.

### Add a service-details page

1. Copy an existing page in `service-details/` that has a similar layout.
2. Change the `<title>`, meta description, canonical and `og:url`, breadcrumbs and content.
3. Use a new key prefix for its `data-i18n` keys and add `en` and `fil` (and ideally `ceb`)
   values to `translations.js`.
4. Link to it from the relevant `services/*.html` page and from `government/index.html` if
   it is an office.
5. Add it to `data/services.json` (for search), `sitemap.xml` and `sitemap/index.html`.

### Add or change a project on the Our Projects page

1. Add an entry to `data/projects.json`: `id`, `name`, `description`, `url`, `repos` (a list
   of `{ "name": "Org/repo", "url": "https://github.com/Org/repo" }`), `type` (`org` or
   `community`), `category`, `status` (`active`, `development` or `archived`) and a Bootstrap
   `icon` class such as `bi-cash-coin`. The tabs, repo filter, category filter and the View
   Details dialog are built from this file, and the build fails if an entry is invalid.
2. Add `proj-<id>-name` and `proj-<id>-desc` to `en`, `fil` and `ceb` in
   `apps/web/src/content/translations.ts` (and `proj-cat-<category>` for a new category).
   `pnpm web:test` fails if a project has no translated name or description, or if its icon
   is not in Bootstrap Icons.
3. If the project is `active`, also add it to the "Our Projects" dropdown in
   `apps/web/src/content/navigation.ts`, with a `nav-projects-<id>` key in `translations.ts`.
4. While the legacy `projects/` page still exists, make the same change in
   `assets/js/translations.js` and `scripts/chrome/header.html` (then `pnpm chrome`).

### Fill an empty data file

The ordinance, resolution, budget, DPWH, CMCI and news files are empty until verified
Bukidnon data is available. To fill one:

1. Get the data from the official source (Sangguniang Panlalawigan records, BLGF, DBM,
   DPWH, DTI CMCI, the Provincial Government's Facebook page).
2. Look at its schema in `apps/web/src/content/schemas.ts` (see
   [architecture.md](architecture.md#content-and-validation)) to see the fields it expects. Keep the existing top-level shape of the file.
3. Add a source and "as of" date in the data where the format allows, and mention the source
   on the page.
4. Load the page locally and check the browser console for errors.

### Province vs. city or municipality

When writing about a service, say who actually provides it:

| Service                                                                    | Who handles it                                                                                                                             |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Birth, marriage and death certificates                                     | City/municipal civil registrar (LCRO) where the event was registered; certified copies from PSA                                            |
| Business permits                                                           | City/municipal BPLO                                                                                                                        |
| Barangay clearance                                                         | The barangay                                                                                                                               |
| Real property tax                                                          | Provincial Treasurer for properties in the 20 municipalities (with the municipal treasurer); the city treasurer in Malaybalay and Valencia |
| Tax declarations                                                           | Provincial Assessor (with the municipal assessor); the city assessor in Malaybalay and Valencia                                            |
| Provincial hospitals, provincial roads, provincial social welfare programs | The Province                                                                                                                               |
| Public schools                                                             | DepEd Division of Bukidnon (the Province supports through the Special Education Fund)                                                      |
| Police and fire                                                            | PNP Bukidnon Police Provincial Office, BFP                                                                                                 |

Do not state fees, processing times or requirements as official unless they come from the
Provincial Government's Citizen's Charter. Otherwise describe the process in general terms
and add "Requirements may vary; confirm with the office."

## Writing style

- Plain, short sentences. Many readers are on phones, on prepaid data, in their second or
  third language.
- Say what to do and where to go. Put phone numbers in `tel:` links.
- Use "Bukidnonon" for people from Bukidnon.
- Don't call the site "official". It is a volunteer project; link to bukidnon.gov.ph for
  official information.
