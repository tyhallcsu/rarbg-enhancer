# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [6.2.8] — 2026-04-30

### Changed
- **README hero image** is now an original screenshot of the floating
  Shadow-DOM settings modal open on a live `rargb.to` page, showing the
  live counter pills (rows / highlighted / hidden) and all toggle
  sections. Replaces the upstream-inherited general-page screenshot
  that didn't surface the differentiating feature of this fork. Old
  asset (`docs/screenshots/Screenshot_Rarbg_general.png`) is preserved
  on disk for reference.
- **README "New in this fork" section** gains a dedicated subsection
  for the floating settings modal, calling out the live-applied counter
  pills, `Esc` / `Ctrl`+`/` keyboard shortcuts, click-outside-to-close
  scrim, and Shadow-DOM isolation from RARBG's page CSS.
- **Auto-update note** in README and `docs/INSTALL.md` no longer warns
  about the private-repo limitation. With the repo public, Tampermonkey's
  `@updateURL` polling works transparently.
- **In-file CHANGELOG comment block** at the top of
  `rarbg-enhancer.user.js` was stale (still labeled "Merged build
  6.2.0"). Truncated to a one-liner pointer to `CHANGELOG.md` so the
  per-version history has a single source of truth.

### Added
- `@contributor Cisco` line in the userscript header — README's Credits
  block already credited Cisco for the original "add magnet link" idea,
  but the header didn't. Now consistent across both.
- `docs/PUBLISH-AUDIT.md` — pre-publication audit captured ahead of
  this release, useful as a checklist for future polish passes.

### Fixed
- `docs/INSTALL.md` no longer points at issue [#34](https://github.com/tyhallcsu/rarbg-enhancer/issues/34)
  as "tracked for a redesign" — the legacy GM_config redesign actually
  shipped in v6.2.6 (closed via [#46](https://github.com/tyhallcsu/rarbg-enhancer/pull/46)).

## [6.2.7] — 2026-05-01

### Fixed
- **Modal toggle switches stretched full-width across their row** —
  regression from v6.2.6's `<span class="switch">` → `<label class="switch">`
  swap. The CSS rule `.row label { flex: 1 1 auto; … }` was generic
  enough to match both the outer text label AND the new inner switch
  label, so flex stretched the switch to fill the right column.
  Fix: tightened the selector to `.row > label:not(.switch)`. Switches
  now render at 38×22 again. Click-forwarding from the v6.2.6 fix is
  preserved.
- **Legacy `GM_config` panel had no Esc-to-close** — added a parent-
  document keydown listener that calls `GM_config.close()` when Esc
  fires AND the iframe is currently visible. Doesn't fire for normal
  Esc presses elsewhere.
- **Legacy panel had no discoverable × button** — added one to the panel
  header via `GM_config.init({ events: { open(doc) {…} } })`. Styled to
  match the modal's × (32×32, hover lightens). The native Close button
  at the bottom is preserved.
- **Legacy panel often overflowed the viewport** — capped iframe to
  `min(85vh, 720px)` × `min(90vw, 640px)` and centered it via
  `inset: 50% auto auto 50%; transform: translate(-50%, -50%)`. Content
  scrolls inside the iframe rather than spilling.

## [6.2.6] — 2026-05-01

### Fixed
- **Toggle switches in the modal weren't clickable** — only the row's text
  label forwarded clicks to the input. Clicking the visible switch element
  did nothing. Fix: changed the switch container from `<span class="switch">`
  to `<label class="switch">` so clicking anywhere inside the switch (slider,
  pill body, or the hidden input) toggles natively. The `.switch` CSS
  selector still applies, so the styling is unchanged.

### Changed
- **Legacy `GM_config` panel completely redesigned** to match the floating
  modal. Always-dark theme (no more `prefers-color-scheme` branch — the
  modal is always dark, the panel matches). Native checkboxes are now
  styled via `appearance: none` into the same toggle-switch look as the
  modal. Native radios get matching custom rendering. Section headers use
  the same uppercase blue-cyan label + underline aesthetic. Save button
  uses the same gradient. Mirrors textarea bumped to 12 lines tall with
  monospace font and dark bg.
- The GM_config iframe element itself (chrome around the panel) gets a
  rounded 14px corner, shadow drop, no black border. Applied via the outer
  document's stylesheet block since `GM_config.init({ css })` only injects
  inside the iframe.

### Added
- Modal footer credits line: `by sharmanhall · github.com/tyhallcsu/rarbg-enhancer`,
  with both pieces linking to the repo.

## [6.2.5] — 2026-05-01

### Fixed
- **FAB click + every modal control still didn't fire in v6.2.4** (re-opens
  and re-closes #42). The v6.2.4 hypothesis ("listener on shadow root vs
  document") was wrong. The actual constraint is stricter: under
  `@grant unsafeWindow`, sandbox-registered listeners don't receive click
  events that ORIGINATE inside our shadow root, regardless of where the
  listener is attached. Mousetrap's `Ctrl+/` worked all along because that
  keydown originates in light DOM.

  Fix: register the delegated click / input / change listeners from
  page-world context by injecting a `<script>` element into the document.
  The handlers call back into the sandbox via `unsafeWindow.__rbhlPanel`'s
  new `dispatchAction(action)` and `dispatchSetting(key, value, isGmc)`
  methods.

  Verification path: install v6.2.5, click the green ⚙ FAB. Modal should
  open. Click each toggle switch — should apply live. Click ×, scrim, or
  Reset — all should respond.

### Changed
- `unsafeWindow.__rbhlPanel` API extended:
  - `dispatchAction(action)` — handles `toggle` / `close` / `open-legacy` / `reset`
  - `dispatchSetting(key, value, isGmc)` — applies a highlighter or GM_config setting

  These are the entry points the page-world delegated handler calls into.
  External callers may continue to use `open` / `close` / `toggle` /
  `isOpen` / `refreshCounter` (unchanged).

### Notes
- Three-version learning curve concluded: shadow-DOM event delegation under
  `@grant unsafeWindow` requires page-world handler registration. Documented
  in `~/.claude/skills/playwright-tampermonkey/SKILL.md` as a known gotcha.

## [6.2.4] — 2026-05-01

### Fixed
- **Floating ⚙ FAB still didn't fire on real user clicks in v6.2.3** (#42).
  The v6.2.3 fix moved the click handler from a per-element listener to a
  delegated listener on the shadow root — which fixed nothing. Empirical
  finding: under `@grant unsafeWindow`, click events on shadow-root
  descendants don't trigger listeners that the userscript's sandbox
  attached to the shadow root, even for trusted clicks. The Mousetrap
  `Ctrl+/` binding kept working because it lives on `document`.

  Fix: moved click + input + change listeners off the shadow root and onto
  `document`, using `event.composedPath()` to detect events that crossed
  our shadow boundary. The walk stops at the host element so we never
  match clicks outside our widget.

  Verified end-to-end on `rargb.to/tv/`:
  - Real user FAB click toggles the modal
  - All toggle switches inside the modal apply live
  - All buttons (Full settings… / Reset / ×) work
  - Ctrl+/ still toggles, Esc still closes

### Notes
- This is the third attempt at this bug (v6.2.2 wrong → v6.2.3 wrong → v6.2.4 right).
  The lesson is that shadow-DOM event delegation under `@grant unsafeWindow`
  needs document-level listeners + composedPath, not shadow-root-level
  listeners. Documented in `~/.claude/skills/playwright-tampermonkey/SKILL.md`.

## [6.2.3] — 2026-04-30

### Fixed
- **Floating ⚙ button click was a no-op on first page load.** Verified live
  on `rargb.to/tv/` via Playwright: bootstrap completed and the FAB rendered
  with all panel children present, but the click listener bound directly to
  the FAB element never fired. Switched the panel to a single delegated
  click handler at the shadow-root level, with `data-action` attributes
  driving each interactive element. Fix is also more resilient to future
  DOM rebuilds. (issue surfaced during this PR's playwright testing)
- **`background` shorthand on highlighted rows clobbered inherited row
  striping** (#6). Switched the highlight CSS rule to `background-color`
  so RARBG's own row-stripe images stay visible.
- **Stale `data-rb-hl` / `data-rb-below` attributes could leak across
  passes** (#7). Highlight pass is now idempotent: it wipes both
  attributes off every `tr.lista2` first, then re-tags. Eliminates leaks
  on threshold change, SPA navigation, and transitional NaN seeder reads.

### Changed
- **Settings modal redesigned end-to-end.** New card-style panel with:
  - Larger 52px gradient FAB with hover/active microinteractions
  - Real header with version badge + 30px circular × close button
  - Live counter pills at the top: rows / highlighted / hidden
  - Custom toggle switches replacing native checkboxes
  - Sectioned scroll body + sticky footer with primary/secondary buttons
  - `Esc` and `Ctrl`+`/` keyboard hints in a styled footer
  - Honors `prefers-reduced-motion`
- **`Ctrl+/` now toggles the new modal** instead of opening the legacy
  `GM_config` panel. The legacy panel is still reachable via the modal's
  "Full settings…" button, the green ⚙ Script Settings navbar tab, or the
  Tampermonkey menu command.
- Exposes `unsafeWindow.__rbhlPanel = { open, close, toggle, isOpen,
  refreshCounter }` so external code (and the Mousetrap binding) can drive
  the modal.

### Added
- Two image-host replacement rules ported from upstream
  [FarisHijazi/Rarbg-Enhancer-UserScript](https://github.com/FarisHijazi/Rarbg-Enhancer-UserScript)
  (commits `1dffea4`, `7504c39`, `841c35d`): `.com/i-1/` → `.com/1/`
  and `/1s/` → `/1/`. (#36)
- `test/artifacts/` directory under the repo for Playwright-driven test
  screenshots. Excluded from lint via existing globs; first artifacts
  committed as before/after evidence for this PR.

## [6.2.2] — 2026-04-30

### Fixed
- **Auto-scroll stalls when rows are filtered out.** When `Hide rows below
  threshold` removes enough rows that the remaining content is shorter than
  the viewport (or the user is already past the new bottom), no scroll
  events fire and InfiniteScroll never advances. `RBHighlighter` now
  detects this after every pass and calls `infScroll.loadNextPage()`
  directly. Capped at 8 consecutive auto-loads, with the counter resetting
  on any user-initiated scroll. New `rbhl_autoScrollAssist` setting
  (default on) toggles the behavior. The `infScroll` instance is now
  exposed via `unsafeWindow.__infScroll` for the highlighter to poke.

### Changed
- **Restyled the legacy `GM_config` settings panel** (closes #34). Replaced
  the one-line CSS string passed to `GM_config.init({ css })` with a
  ~110-line stylesheet that gives the panel a proper card container,
  flex-laid-out fields, real button hierarchy, monospace `mirrors`
  textarea (10 lines tall, was clipped to 2), and full
  `prefers-color-scheme: dark` support. Selectors are all `#GM_config`-
  prefixed so nothing leaks into the page itself.

### Added
- New floating-modal toggle: **"Auto-scroll when filtered short"**
  (`rbhl_autoScrollAssist`, default `true`).

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

[Unreleased]: https://github.com/tyhallcsu/rarbg-enhancer/compare/v6.2.8...HEAD
[6.2.8]: https://github.com/tyhallcsu/rarbg-enhancer/compare/v6.2.7...v6.2.8
[6.2.7]: https://github.com/tyhallcsu/rarbg-enhancer/compare/v6.2.6...v6.2.7
[6.2.6]: https://github.com/tyhallcsu/rarbg-enhancer/compare/v6.2.5...v6.2.6
[6.2.5]: https://github.com/tyhallcsu/rarbg-enhancer/compare/v6.2.4...v6.2.5
[6.2.4]: https://github.com/tyhallcsu/rarbg-enhancer/compare/v6.2.3...v6.2.4
[6.2.3]: https://github.com/tyhallcsu/rarbg-enhancer/compare/v6.2.2...v6.2.3
[6.2.2]: https://github.com/tyhallcsu/rarbg-enhancer/compare/v6.2.1...v6.2.2
[6.2.1]: https://github.com/tyhallcsu/rarbg-enhancer/compare/v6.2.0...v6.2.1
[6.2.0]: https://github.com/tyhallcsu/rarbg-enhancer/releases/tag/v6.2.0
