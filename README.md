# RARBG Enhancer

Tampermonkey userscript for RARBG mirrors — seeder-based row highlighting, filtering, and a floating settings modal.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-6.2.0-green.svg)](rarbg-enhancer.user.js)
[![Install](https://img.shields.io/badge/install-userscript-orange.svg)](https://github.com/tyhallcsu/rarbg-enhancer/raw/main/rarbg-enhancer.user.js)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-supported-success.svg)](https://www.tampermonkey.net/)
[![Violentmonkey](https://img.shields.io/badge/Violentmonkey-supported-success.svg)](https://violentmonkey.github.io/)

> A merged fork of [RARBG Enhancer 6](https://greasyfork.org/) and
> [RARBG Torrents – Dynamic Column Highlighting v5](https://greasyfork.org/scripts/493324)
> by sharmanhall, plus a Shadow-DOM floating settings modal.

## Screenshot

![RARBG Enhancer in action](docs/screenshot.png)

> _Screenshot placeholder — see `docs/INSTALL.md` for install screenshots._

## Features

### Highlighting & filtering (new in 6.2.0)
- **Dynamic seeder-column detection** — finds the seeder column by scanning for
  `.lista2t a[href*="seeders"]`, so it survives column reordering across mirrors.
- **Threshold-based row coloring** — rows with seeders ≥ threshold get a
  configurable highlight color. Defaults: `≥100`, `#c0edc8`.
- **Hide rows below threshold** — optional filter to declutter low-seeder rows.
  Composes cleanly with the enhancer's existing row-hiding logic.
- **`MutationObserver`-driven** — re-highlights on every row mutation
  (including infinite-scroll-appended rows), instead of polling every second.

### Settings modal (new in 6.2.0)
- Floating ⚙ button (bottom-right) opens a Shadow-DOM modal — RARBG's
  aggressive page CSS cannot leak in.
- Live controls: enable highlighting, threshold, color, hide-below-threshold.
- Shortcuts to existing enhancer toggles: large thumbnails, infinite scroll,
  hide recommended torrents, thumbnail hover sound.
- Closes on `Esc`, click-outside, or the explicit × button.

### Inherited from RARBG Enhancer 6
- Auto-solve threat-defence CAPTCHA (OCRAD).
- Magnet link + .torrent download shortcuts on every row.
- Inline content thumbnails with hover preview and size controls.
- Image-search links per torrent (Google / DuckDuckGo / Yandex).
- Infinite scroll across paginated results.
- Static search bar, deduplicate-torrents, category blocking.
- Auto-exit `/indexN.php` redirects.
- "Script Settings" tab + `Ctrl+/` to open the legacy `GM_config` panel.

## Install

### Prerequisites
A userscript manager. Pick one:
- [Tampermonkey](https://www.tampermonkey.net/) (Chrome / Edge / Firefox / Safari / Opera)
- [Violentmonkey](https://violentmonkey.github.io/) (Chrome / Edge / Firefox)

### One-click install
1. Make sure your userscript manager is enabled.
2. Open the raw script:
   👉 **[Install rarbg-enhancer.user.js](https://github.com/tyhallcsu/rarbg-enhancer/raw/main/rarbg-enhancer.user.js)**
3. Tampermonkey / Violentmonkey will detect the userscript and prompt to install. Click **Install**.

### Manual install
1. Download [`rarbg-enhancer.user.js`](rarbg-enhancer.user.js).
2. Open Tampermonkey → **Dashboard → Utilities → Import from file**, or paste
   into a new userscript via **Dashboard → + (new)**.

See [`docs/INSTALL.md`](docs/INSTALL.md) for screenshots.

## Configuration

Click the green **⚙** button in the bottom-right of any RARBG mirror page to
open the floating settings modal. See [`docs/SETTINGS.md`](docs/SETTINGS.md) for
the full reference.

| Setting | Default | What it does |
|---|---|---|
| Enable highlighting | `on` | Master switch. Off → no row coloring, no hiding. |
| Seeder threshold | `100` | Rows with seeders **≥** this value are highlighted. |
| Highlight color | `#c0edc8` | Background color applied to highlighted rows. |
| Hide rows below threshold | `off` | When on, rows below threshold are hidden. |
| Large thumbnails | (enhancer) | Toggles enhancer's large-thumbnail mode. |
| Infinite scrolling | (enhancer) | Toggles enhancer's infinite scroll. |
| Hide recommended torrents | (enhancer) | Removes the "recommended" sidebar block. |
| Thumbnail hover sound | (enhancer) | Plays a click sound on thumbnail hover. |

Highlight settings persist across reloads under `GM_setValue` keys
`rbhl_enabled`, `rbhl_threshold`, `rbhl_color`, `rbhl_hideBelow`. Enhancer
toggles persist via the legacy `GM_config` storage. Settings apply live — no
reload required for the highlight controls.

You can also open the legacy full settings panel by clicking
**"Open full settings…"** in the modal, by pressing `Ctrl+/`, or via the
green **⚙ Script Settings** tab the script injects into the page navbar.

## Supported mirrors

The userscript runs on the following hosts (and any URL matching
`https://*rarbg.*`):

```
proxyrarbg.org      rarbg.com           rarbg.to            rarbg2018.org
rarbg2019.org       rarbg2020.org       rarbg2021.org       rarbgaccess.org
rarbgaccessed.org   rarbgcdn.org        rarbgcore.org       rarbgdata.org
rarbgenter.org      rarbgget.org        rarbggo.org         rarbgindex.org
rarbgmirror.com     rarbgmirror.org     rarbgmirrored.org   rarbgp2p.org
rarbgproxied.org    rarbgproxies.org    rarbgproxy.com      rarbgproxy.org
rarbgprx.org        rarbgto.org         rarbgtor.org        rarbgtorrents.org
rarbgunblock.com    rarbgunblock.org    rarbgunblocked.org  rarbgway.org
rarbgweb.org        unblockedrarbg.org  www.proxyrarbg.to   www.rarbg.is
www.rarbggo.to      www.rarbgo.to       www.rarbgproxy.to   www2.rarbggo.to
```

## Development

### File layout

```
.
├── rarbg-enhancer.user.js      # the userscript (single-file deliverable)
├── scripts/
│   └── validate-header.js      # CI: parses @-fields, asserts JS validity
├── docs/
│   ├── INSTALL.md              # detailed install walkthrough
│   ├── SETTINGS.md             # full settings reference
│   └── screenshot.png          # (placeholder)
├── .github/
│   ├── ISSUE_TEMPLATE/         # bug + feature forms
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── workflows/ci.yml        # lint + validate on push/PR
│   └── dependabot.yml
├── CHANGELOG.md
├── CONTRIBUTING.md
├── HANDOFF.md
└── package.json                # devDeps only (eslint, prettier)
```

### Local testing

The fastest loop:

1. Open Tampermonkey → **Dashboard**.
2. Find **RARBG Enhancer + Highlighter (Merged)** → click the script name → the
   built-in editor opens.
3. Paste your local edits in (or use Tampermonkey's "edit on disk" if your
   manager supports it). Save.
4. Hard-reload a RARBG mirror page (`Cmd-Shift-R` / `Ctrl-Shift-R`).

Some browsers require enabling **Developer mode** for Tampermonkey before
file-based loading works — see [Tampermonkey FAQ](https://www.tampermonkey.net/faq.php).

### Scripts

```bash
npm install            # install eslint + prettier
npm run lint           # ESLint over userscript + scripts/
npm run format         # Prettier write
npm run validate       # parse @-fields + JS syntax check
npm run ci             # what GitHub Actions runs
```

## Credits

- **Dynamic seeder-column highlighting (v5)** — [sharmanhall](https://greasyfork.org/scripts/493324)
- **RARBG Enhancer 6 (base)** — Faris Hijazi (original) + tyhallcsu (fork)
- **Helper code** — darkred ([greasyfork.org/users/2160](https://greasyfork.org/en/users/2160-darkred))

## License

[MIT](LICENSE) © 2026 Tyler Hall, with attribution to prior authors above.
