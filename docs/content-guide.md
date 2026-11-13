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
| Homepage                                                | `apps/web/src/features/home/` and the `home_*` keys in `apps/web/messages/*.json`                                                                |
| Governor, Vice Governor, Board Members, representatives | `data/officials.json` (rendered by `assets/js/officials.js`) and the cards in `government/index.html` and `index.html`                           |
| Cities, municipalities and districts                    | `government/index.html` (section `#lgus`) and `data/demographics.json`                                                                           |
| Population and area                                     | `data/demographics.json`, the homepage stat cards, `statistics/index.html`                                                                       |
| Service categories                                      | `data/service-categories.json` (each `/services/<id>` page, in EN, FIL and CEB); the directory cards in `apps/web/src/routes/services/index.tsx` |
| Office pages and document guides                        | `content/services/<slug>/{en,fil,ceb}.mdx` (PSWDO and eight other offices so far); the rest are still `service-details/*.html`                   |
| Search results                                          | `data/services.json` (titles, keywords, offices) and the engine in `apps/web/src/features/services/search.ts`                                    |
| Capitol directory                                       | `contact/index.html`                                                                                                                             |
| Ordinances and resolutions                              | `data/ordinances.json`, `data/resolutions.json`                                                                                                  |
| Budget, SRE and DPWH projects                           | `data/fiscal_transparency.json`, `data/dpwh-projects.json`                                                                                       |
| News                                                    | `data/news.json` (see [news-curation.md](news-curation.md))                                                                                      |
| Our Projects page and nav dropdown                      | `data/projects.json` (validated in `apps/web/src/features/projects/`), the "Our Projects" dropdown in `apps/web/src/config/navigation.ts`        |
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

### Write or change a service guide (MDX)

Service guides such as `/service-details/pswdo` are documents in
`content/services/<slug>/`, one file per language: `en.mdx` (required), `fil.mdx` and
`ceb.mdx`. A language without a file shows the English text; that page points search engines
to the English one and leaves the sitemap until it is translated. The slug must exist in
`data/services.json`.

Each file starts with frontmatter, then Markdown and a small set of blocks that reproduce the
legacy design:

```mdx
---
title: Provincial Social Welfare and Development Office (PSWDO) # page heading
shortTitle: Provincial Social Welfare and Development Office # breadcrumb and browser title
description: One or two sentences for search results and link previews (50-300 characters).
summary: The line under the heading
badge: Social Welfare
icon: heart-fill # Bootstrap Icons name
parent: /services/social-services # breadcrumb parent: a /services/<category> page or /government; omit to go straight from Services
---

<Section alt icon="list-ol" title="How to Ask for Help" intro="General steps.">

<Columns>

<Box title="Steps">

1. Numbered steps get numbered icons.
2. ...

</Box>

<Box title="What to Bring" note="Requirements may vary; confirm with the office.">

- Bullet lists get check icons (`listIcon="check"` changes them).

</Box>

</Columns>

</Section>
```

| Block                                   | Use                                                                                                                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `<Section alt icon title intro>`        | A band of the page; `alt` makes it grey. Without `title` it has no heading                                                                                               |
| `<Stats>` with `<Stat icon label>`      | Four quick facts (office, location, hours, days)                                                                                                                         |
| `<CharterNote>`                         | The volunteer-guide disclaimer, ending with a Markdown link                                                                                                              |
| `<Prose>`                               | Paragraphs of running text in a box                                                                                                                                      |
| `<Cards>` with `<Card icon title tags>` | A grid of programs or services; the text or a list goes between the tags. `tags="PWD"` or `tags={["Businesses", "Provincial tax"]}`                                      |
| `<Columns>`                             | Two columns (one on phones)                                                                                                                                              |
| `<Box title icon listIcon note>`        | A box with a heading and a list                                                                                                                                          |
| `<OfficeInfo address hours phone>`      | Address, hours and a tap-to-call number. For several numbers or a note, put `<Phone number="(088) 813-5741">(Capitol main line)</Phone>` items inside instead of `phone` |
| `<LinkButton href icon>`                | A button link on its own line                                                                                                                                            |
| Markdown table                          | A fee or schedule table (blue header row); `<Danger>` inside a cell makes it red                                                                                         |
| `<TableNote>`                           | The small source line under a table                                                                                                                                      |

- Leave a blank line around Markdown inside a block, as above.
- Links: app paths (`/government#lgus`) stay in the reader's language; `https://` links open
  in a new tab.
- No `import`, `export` or other components: `pnpm web:test` fails on anything not in the
  table, on unknown icons and on invalid frontmatter.
- Keep the same blocks, in the same order, in every language. Text that is not translated yet
  can stay in English in `fil.mdx` or `ceb.mdx`.

Office pages not yet converted are still the legacy `service-details/*.html` files; new guides
go in `content/services/`.

### Add or change a project on the Our Projects page

1. Add an entry to `data/projects.json`: `id`, `name`, `description`, `url`, `repos` (a list
   of `{ "name": "Org/repo", "url": "https://github.com/Org/repo" }`), `type` (`org` or
   `community`), `category`, `status` (`active`, `development` or `archived`) and a Bootstrap
   `icon` class such as `bi-cash-coin`. The tabs, repo filter, category filter and the View
   Details dialog are built from this file, and the build fails if an entry is invalid.
2. Add `proj_<id>_name` and `proj_<id>_desc` to `apps/web/messages/{en,fil,ceb}.json` (and
   `proj_cat_<category>` for a new category), and map them in `projectText` in
   `apps/web/src/features/projects/projects-page.tsx`. `pnpm web:test` fails if a project has no name or
   description in a language, or if its icon is not in Bootstrap Icons.
3. If the project is `active`, also add it to the "Our Projects" dropdown in
   `apps/web/src/config/navigation.ts`, with a `nav_projects_<id>` message.
4. While the legacy `projects/` page still exists, make the same change in
   `assets/js/translations.js` and `scripts/chrome/header.html` (then `pnpm chrome`).

### Fill an empty data file

The ordinance, resolution, budget, DPWH, CMCI and news files are empty until verified
Bukidnon data is available. To fill one:

1. Get the data from the official source (Sangguniang Panlalawigan records, BLGF, DBM,
   DPWH, DTI CMCI, the Provincial Government's Facebook page).
2. Look at its schema in the feature's data module, such as
   `apps/web/src/features/legislative/data.ts` (see
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
