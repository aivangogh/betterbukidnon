# BetterBukidnon.org

A volunteer-run civic portal for the **Province of Bukidnon**, Philippines: provincial
services, officials, emergency hotlines, statistics and public records in one easy-to-read
site, in English, Filipino and Cebuano (Binisaya).

BetterBukidnon.org is part of the [BetterGov.ph](https://bettergov.ph) volunteer ecosystem.
It is **not** an official government website. The Provincial Government of Bukidnon's
official site is [bukidnon.gov.ph](https://bukidnon.gov.ph/).

**Cost to the People of Bukidnon = ₱0**

![License](https://img.shields.io/badge/license-MIT%20%7C%20CC%20BY%204.0-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white)

- Production: [betterbukidnon.org](https://betterbukidnon.org)
- Development: [dev.betterbukidnon.org](https://dev.betterbukidnon.org)

## What's on the site

| Section         | Content                                                                                                                                                                                              |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Services        | What the Province does in health, social welfare, agriculture, infrastructure, tax, education, environment and public safety, and which office to go to                                              |
| Service details | One page per provincial office (Treasurer, Assessor, PSWDO, PHO, PDRRMD, PEO, PPDO, …) plus guides for civil registry documents and business permits, which are handled by cities and municipalities |
| Government      | Governor, Vice Governor, Sangguniang Panlalawigan, congressional districts, and the 2 cities and 20 municipalities                                                                                   |
| Statistics      | Population (2024 POPCEN), land area, barangays, per-LGU table                                                                                                                                        |
| Legislative     | How provincial ordinances and resolutions are made                                                                                                                                                   |
| Transparency    | Where to find the provincial budget and financial reports                                                                                                                                            |
| Contact         | Capitol directory and emergency hotlines                                                                                                                                                             |

## Quick start

```bash
git clone https://github.com/DMNCDLPRT/betterbukidnon.git
cd betterbukidnon
npm install
npm run dev            # http://localhost:8000
```

Production build: `pnpm build` writes `apps/web/dist/client`, which Cloudflare Workers serves as
static assets (see `wrangler.jsonc`).

## Documentation

Everything else is in [docs/](docs/README.md):

- [Getting started](docs/getting-started.md): local setup, build, tests, branches
- [Architecture](docs/architecture.md): pages, scripts, data files, React app, build pipeline
- [Content guide](docs/content-guide.md): updating officials, hotlines, services and data
- [Bukidnon fact sheet](docs/bukidnon-facts.md): every province fact the site uses, with sources
- [Translations](docs/translations.md): how EN / FIL / CEB work and how to edit them
- [Deployment](docs/deployment.md): Cloudflare Workers environments and the launch checklist
- [Claude Code subagents](docs/claude-code.md): the AI helpers included in `.claude/agents/`
- [Rebrand notes](docs/rebrand-from-bettersolano.md): what changed from the BetterSolano template

## Technology

Plain HTML5, CSS3 and vanilla JavaScript, with JSON data files and no backend. One page
(`/services/health`) is built with Next.js 14 and TypeScript. Charts use Chart.js, maps use
OpenStreetMap and Leaflet, icons are Bootstrap Icons, and weather comes from Open-Meteo.
Hosting is Cloudflare Workers static assets. The site is also an installable PWA with
offline support.

## Contributing

Developers, designers, writers, translators (especially Binisaya, Binukid and Higaonon) and
researchers are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md), then open an issue or a
pull request into `develop`. Province facts must come from official sources; see the
[fact sheet](docs/bukidnon-facts.md).

## Data sources

| Source                                                        | Used for                            |
| ------------------------------------------------------------- | ----------------------------------- |
| [Provincial Government of Bukidnon](https://bukidnon.gov.ph/) | Offices, contact directory          |
| [Philippine Statistics Authority](https://psa.gov.ph/)        | Population, PSGC                    |
| [COMELEC](https://comelec.gov.ph/) and news reports           | 2025 election results               |
| [Bureau of Local Government Finance](https://blgf.gov.ph/)    | Financial reports (to be added)     |
| [DTI CMCI](https://cmci.dti.gov.ph/)                          | Competitiveness index (to be added) |

## License

Dual-licensed, like the template it comes from:

| License   | Applies to                                 |
| --------- | ------------------------------------------ |
| MIT       | Source code                                |
| CC BY 4.0 | Content (text, images, data, translations) |

See [LICENSE](LICENSE).

## Credits

- Built on the [BetterSolano](https://github.com/BetterSolano/bettersolano) template by
  [Ramon Logan Jr.](https://ramonloganjr.com/), used under the MIT and CC BY 4.0 licenses.
- [BetterGov.ph](https://bettergov.ph) for the civic-tech movement this project belongs to.
- Map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.
- Claude Code subagents from
  [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) (MIT).
- Every volunteer who gives their time to the people of Bukidnon.

## Contact

- Email: volunteer@betterbukidnon.org
- GitHub: [DMNCDLPRT/betterbukidnon](https://github.com/DMNCDLPRT/betterbukidnon)
