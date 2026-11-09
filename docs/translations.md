# Translations

The site is available in three languages:

| Code  | Language           | Coverage                                                                                   |
| ----- | ------------------ | ------------------------------------------------------------------------------------------ |
| `en`  | English            | Complete; the fallback for everything                                                      |
| `fil` | Filipino           | Near complete                                                                              |
| `ceb` | Cebuano (Binisaya) | Navigation, buttons, headings, footer and shared page text; the rest falls back to English |

Cebuano replaced the upstream template's Ilocano because it is the language most widely
spoken in Bukidnon. Binukid, Higaonon and other indigenous languages would be welcome
additions. See "Adding a language" below.

## How it works

All dictionaries and the engine live in `assets/js/translations.js`:

```js
const translations = {
  en:  { 'nav-home': 'Home', ... },
  fil: { 'nav-home': 'Tahanan', ... },
  ceb: { 'nav-home': 'Panguna', ... },
};
const TranslationEngine = { ... };
```

On page load, `TranslationEngine.init()` picks the language: the saved choice in
`localStorage.selectedLang`, then the browser language (`tl`/`fil` → Filipino,
`ceb`/`bis` → Cebuano), then English. It then walks the page:

| Attribute                     | What gets replaced          |
| ----------------------------- | --------------------------- |
| `data-i18n="key"`             | the element's `textContent` |
| `data-i18n-placeholder="key"` | `placeholder`               |
| `data-i18n-title="key"`       | `title`                     |
| `data-i18n-aria="key"`        | `aria-label`                |
| `data-i18n-alt="key"`         | `alt`                       |

A missing key in `fil` or `ceb` falls back to `en`. A key missing everywhere leaves the HTML
text as it is.

## Rules that trip people up

1. **The dictionary wins over the HTML, even in English.** If you change the text inside a
   `data-i18n` element but not the dictionary, visitors still see the old text. Change the
   `en` value (and `fil`, `ceb`) for that key, or give the element a new key.
2. **`textContent` wipes child elements.** `<p data-i18n="x">Call <a href="…">911</a></p>`
   loses its link once translated. Put the attribute on a `<span>` that holds plain text
   only, and keep links and `<strong>` outside it.
3. **Keys are per page.** Most keys carry a page prefix (`treas-`, `pswdo-`, `gov-`,
   `home-`). The skip link, header and footer are the exception: they are shared across all
   pages and use `nav-*` and `footer-*`, so reword them once (see
   [architecture.md](architecture.md#legacy-static-pages)).
4. **Keep placeholders.** Strings like `Showing {{count}} results` are interpolated. Leave
   `{{count}}` untouched in every language.

## Editing translations

For a few strings, edit `assets/js/translations.js` directly. Each language block is a flat
list of `'key': 'value',` lines, with `en` first, then `fil`, then `ceb`.

For many strings, write a patch file and merge it with a small Node script that loads the
dictionaries, changes them and writes the file back. That was how the Bukidnon conversion
was done: each change set was a JSON patch of this shape:

```json
{
  "en": { "home-volunteer-cta": "Contribute on GitHub" },
  "fil": { "home-volunteer-cta": "Mag-ambag sa GitHub" },
  "ceb": { "home-volunteer-cta": "Motabang sa GitHub" },
  "remove": ["home-take-the-quiz"]
}
```

To load the dictionaries in Node, evaluate the part of the file before
`const TranslationEngine` (the rest touches `document` and fails outside a browser):

```js
const src = require('fs').readFileSync('assets/js/translations.js', 'utf8');
const head = src.slice(0, src.indexOf('\nconst TranslationEngine'));
const ctx = {};
require('vm').runInNewContext(head + ';this.t = translations;', ctx);
// ctx.t.en, ctx.t.fil, ctx.t.ceb
```

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

1. Add a block to `translations` (e.g. `bkd: { … }`). Start with navigation, buttons and
   headings; everything else falls back to English.
2. In `TranslationEngine`, add the code to `supportedLangs`, `langNames` and `langCodes`, and
   to `detectBrowserLanguage` if browsers report it.
3. Add a `.lang-btn` button for it in the `.lang-selector` of `scripts/chrome/header.html`
   (then run `npm run chrome`), and its
   name to `names` in `initLanguageMenu` (`assets/js/main.js`), which turns those buttons
   into the globe language menu. In `react-app/src/components/layout/Header.tsx`, add it to
   `LANGUAGE_OPTIONS`. Also add a `hreflang` link in each page's `<head>`.
4. Add the language to `react-app/src/contexts/LanguageContext.tsx`.
