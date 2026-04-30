# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [6.2.1] — 2026-04-30

### Added
- Real demo screenshots and icons under `docs/screenshots/` and `docs/icons/`,
  imported from upstream
  [FarisHijazi/Rarbg-Enhancer-UserScript](https://github.com/FarisHijazi/Rarbg-Enhancer-UserScript)
  under MIT. README and `docs/INSTALL.md` now use them in place of placeholders.
- `docs/CODE-WALKTHROUGH.md` — adapted from upstream `docs.md`, with notes
  about the highlighter's column detection and CSS attribute approach.
- `@homepageURL` and `@supportURL` userscript-header fields pointing at this
  repo and its issues page.

### Changed
- Fixed `@updateURL` and `@downloadURL` to point at the canonical raw URL of
  this repo (`tyhallcsu/rarbg-enhancer` on `main`). Previously pointed at a
  non-existent fork URL.
- Normalized `@updateURL` capitalization (was `@updateUrl`).
- Updated `@namespace` to match the actual repo (`tyhallcsu/rarbg-enhancer`).

### Notes
- Auto-update via `@updateURL` will not work while the repo is private —
  GitHub raw URLs require authentication for private repos. Re-install via
  the install link or make the repo public for transparent auto-updates.

## [6.2.0] — 2026-04-30

### Added
- **Seeder-based row highlighting** — ported from "RARBG Torrents – Dynamic Column Highlighting v5"
  by sharmanhall. Detects the seeder column dynamically by scanning for
  `.lista2t a[href*="seeders"]`, so it survives column reordering across mirrors.
- **Hide rows below seeder threshold** — toggleable filter that hides any row whose
  seeder count is below the configured threshold. Uses a `data-rb-below` attribute
  + CSS rule, so it composes cleanly with the enhancer's existing inline-style
  hiding (search filter, hide-empty-torrents).
- **Floating modal settings panel** — bottom-right ⚙ button opens a Shadow-DOM
  modal with controls for: highlight enable/disable, seeder threshold, highlight
  color, hide-below-threshold toggle, and shortcuts to existing enhancer toggles
  (large thumbnails, infinite scroll, hide recommended, hover sound).
  Closes on `Esc`, click-outside, or the explicit × button. Settings apply live
  (no reload required).
- New persistence namespace `rbhl_*` (separate from the legacy `GM_config` keys),
  storing: `rbhl_enabled`, `rbhl_threshold`, `rbhl_color`, `rbhl_hideBelow`.
- Tooling: ESLint, Prettier, EditorConfig, header validator, GitHub Actions CI,
  Dependabot, issue + PR templates.

### Changed
- Replaced the v5 highlighter's `setInterval(highlightTorrents, 1000)` polling
  with a `MutationObserver` attached to every `.lista2t > tbody`. A 3-second
  fallback interval engages only when no tbody is present at attach time.
- Highlight color is now applied via a stylesheet rule keyed off
  `tr.lista2[data-rb-hl="1"]` instead of inline `row.style.background`, so the
  enhancer's own row-level features keep working.
- Bumped `@version` from `6.0.1` to `6.2.0`.

### Credits
- v5 Dynamic Column Highlighting logic — sharmanhall ([greasyfork.org/scripts/493324](https://greasyfork.org/scripts/493324))
- Original RARBG Enhancer 6 — Faris Hijazi
- Additional code — darkred ([greasyfork.org/users/2160-darkred](https://greasyfork.org/en/users/2160-darkred))

## [6.0.1] — Pre-merge baseline

Last release of the upstream "RARBG Enhancer Fork 6.0.1 (WORKS)" before this
repository began. See the userscript header for prior history.

[Unreleased]: https://github.com/tyhallcsu/rarbg-enhancer/compare/v6.2.1...HEAD
[6.2.1]: https://github.com/tyhallcsu/rarbg-enhancer/compare/v6.2.0...v6.2.1
[6.2.0]: https://github.com/tyhallcsu/rarbg-enhancer/releases/tag/v6.2.0
