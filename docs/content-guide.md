# Content Guide

How to change what the site says. Read [translations.md](translations.md) first: most visible
text exists twice, once in the HTML and once in `assets/js/translations.js`, and the dictionary
wins.

Before changing a fact (a name, a number, a date), update
[bukidnon-facts.md](bukidnon-facts.md) with the new value and its source. Then update the
pages listed below.

## Where things live

| What                                                    | Where                                                                                                                                 |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Emergency hotline bar                                   | `scripts/chrome/hotline.html` (then `npm run chrome`), plus `react-app/src/components/layout/HotlineBar.tsx`                          |
| Header, navigation and footer                           | `scripts/chrome/header.html`, `footer.html` (then `npm run chrome`), plus the React `Header.tsx` and `Footer.tsx`                     |
| Homepage                                                | `index.html` and the `home-*` keys in `translations.js`                                                                               |
| Governor, Vice Governor, Board Members, representatives | `data/officials.json` (rendered by `assets/js/officials.js`) and the cards in `government/index.html` and `index.html`                |
| Cities, municipalities and districts                    | `government/index.html` (section `#lgus`) and `data/demographics.json`                                                                |
| Population and area                                     | `data/demographics.json`, the homepage stat cards, `statistics/index.html`                                                            |
| Service categories                                      | `services/*.html`                                                                                                                     |
| Office pages and document guides                        | `service-details/*.html`                                                                                                              |
| Search results                                          | `data/services.json` and `assets/js/search.js`                                                                                        |
| Capitol directory                                       | `contact/index.html`                                                                                                                  |
| Ordinances and resolutions                              | `data/ordinances.json`, `data/resolutions.json`                                                                                       |
| Budget, SRE and DPWH projects                           | `data/fiscal_transparency.json`, `data/dpwh-projects.json`                                                                            |
| News                                                    | `data/news.json` (see [news-curation.md](news-curation.md))                                                                           |
| Our Projects page and nav dropdown                      | `data/projects.json` (rendered by `assets/js/projects.js`), the "Our Projects" dropdown in `scripts/chrome/header.html`, `Header.tsx` |
| Sitemap                                                 | `sitemap.xml` and `sitemap/index.html`                                                                                                |

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
   `icon`. The tabs, repo filter, category filter and the View Details dialog are built from
   this file.
2. Add `proj-<id>-name` and `proj-<id>-desc` to `en`, `fil` and `ceb` in `translations.js`
   (and `proj-cat-<category>` for a new category). The JSON text is the English fallback.
3. If the project is `active`, also add it to the "Our Projects" dropdown: add an `<li>` to
   the dropdown in `scripts/chrome/header.html` and run `npm run chrome`, add
   `EXTERNAL_PROJECTS` in `react-app/src/components/layout/Header.tsx`, and add a
   `nav-projects-<id>` key in `translations.js` and `LanguageContext.tsx`.
4. Bump `CACHE_VERSION` in `sw.js` so browsers pick up the new data.

### Fill an empty data file

The ordinance, resolution, budget, DPWH, CMCI and news files are empty until verified
Bukidnon data is available. To fill one:

1. Get the data from the official source (Sangguniang Panlalawigan records, BLGF, DBM,
   DPWH, DTI CMCI, the Provincial Government's Facebook page).
2. Look at the script that renders it (see [architecture.md](architecture.md#javascript)) to
   see the fields it expects. Keep the existing top-level shape of the file.
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
