# Translations

The site is available in three languages:

| Code  | Language           | URL                    | Coverage                                                                                   |
| ----- | ------------------ | ---------------------- | ------------------------------------------------------------------------------------------ |
| `en`  | English            | `/services/health`     | Complete; the fallback for everything                                                      |
| `fil` | Filipino           | `/fil/services/health` | Near complete                                                                              |
| `ceb` | Cebuano (Binisaya) | `/ceb/services/health` | Navigation, buttons, headings, footer and shared page text; the rest falls back to English |

Cebuano replaced the upstream template's Ilocano because it is the language most widely
spoken in Bukidnon. Binukid, Higaonon and other indigenous languages would be welcome
additions. See "Adding a language" below.

## How it works

Every page exists once per language, at its own URL, and is prerendered as a static HTML
page. The language comes only from the URL: English at the root, Filipino under `/fil`,
Cebuano under `/ceb`. The globe menu links to the same page in the other languages. There is
no automatic redirect by browser language, so every language version stays reachable for
visitors and search engines.

Text comes from three places, depending on what it is:

| What                                                           | Where                                                  | Example                        |
| -------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------ |
| Interface text (navigation, buttons, headings, footer, labels) | `apps/web/messages/{en,fil,ceb}.json`                  | `"nav_home": "Tahanan"`        |
| Records shared across pages (category pages, later officials…) | `data/*.json`, each string as `{ "en", "fil", "ceb" }` | `data/service-categories.json` |
| Documents (service guides, later FAQ and policies)             | `content/<collection>/<slug>/{en,fil,ceb}.mdx`         | `content/services/pswdo/`      |

A missing Filipino or Cebuano message, record string or document falls back to English. A
document without a translation is not listed as its own language version: its Filipino or
Cebuano URL shows the English text and names the English page as canonical, so search engines
do not index two copies. Translate a document by adding `fil.mdx` or `ceb.mdx` next to
`en.mdx` (see [content-guide.md](content-guide.md)).

Interface messages are compiled by [Paraglide JS](https://paraglidejs.com) into typed
functions: `m.nav_home()` in code. A message that is used in code but missing from
`en.json` fails the type check, so typos cannot ship.

## Editing interface text

Each language has one flat JSON file in `apps/web/messages/`. Keys are the same in every
file; `en.json` has every key.

```json
{
  "nav_home": "Tahanan",
  "proj_showing": "Ipinapakita ang {count} proyekto"
}
```

- **Keep placeholders.** `{count}` and other `{name}` placeholders are filled in by the
  page. Keep them, spelled exactly the same, in every language. `pnpm web:test` fails if a
  translation's placeholders differ from English.
- **Only translate keys that exist in English.** A key in `fil.json` that is not in
  `en.json` fails `pnpm web:test`.
- To add a new piece of interface text, add the key to `en.json` (and `fil.json`,
  `ceb.json` if you have the translation), then use `m.your_key()` in the component.
  `pnpm web:messages` regenerates the typed functions; `pnpm web:dev` does it automatically.
- Page titles and descriptions for search results are messages too (`seo_*_title`,
  `seo_*_description`).

## Editing record data

Strings in data files carry every language next to each other:

```json
"title": {
  "en": "Health Services",
  "fil": "Mga Serbisyong Pangkalusugan",
  "ceb": "Mga Serbisyo sa Panglawas"
}
```

`en` is required; leave out `fil` or `ceb` rather than copying the English text, so the
gap stays visible. See [content-guide.md](content-guide.md) for each data file.

## Style

- **Filipino:** natural Tagalog-based Filipino. Keep official names in English where people
  use them that way ("Provincial Treasurer's Office", "Sangguniang Panlalawigan").
- **Cebuano:** everyday Binisaya as spoken in Malaybalay and Valencia, with the loanwords
  people use (serbisyo, opisina, permit, sertipiko, amilyar for real property tax).
  "Probinsya", not "Lalawigan"; "Gobyerno", not "Pamahalaan".
- Keep acronyms, phone numbers, email addresses, URLs and peso amounts unchanged.
- Some older Filipino strings inherited from the template are machine-translated and read
  awkwardly. Fixes are welcome.

## Adding a language

1. Add the code to `locales` in `apps/web/project.inlang/settings.json` and create
   `apps/web/messages/<code>.json`. Start with navigation, buttons and headings; everything
   else falls back to English.
2. Add a URL pattern for it in `apps/web/paraglide.config.ts`, before the English pattern,
   and its name to `localeNames` in `apps/web/src/components/i18n/locale-provider.tsx`.
3. Add it to the locale lists in `apps/web/src/lib/seo.ts` (`og:locale`),
   `apps/web/vite.config.ts` (prerendered pages), `scripts/generate-seo-files.ts` and
   `scripts/check-seo.ts`, and to `localizedTextSchema` in `apps/web/src/content/schemas.ts`.
4. Run `pnpm build && pnpm seo:check`: every page should now exist in the new language with
   `hreflang` links in all the others.

## The legacy site

The legacy static pages at the repository root still use `assets/js/translations.js` and
`data-i18n` attributes until they are removed. Do not add new text there; add it to the app.
