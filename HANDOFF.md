# HANDOFF — rarbg-enhancer

> Living doc for resuming work on this repo. Update on every meaningful change.
> If something here is stale, fix it before doing anything else.

## Current state — 2026-04-30

- **Version shipped**: `6.2.0`
- **Branch**: `main`
- **CI status**: passing (lint + header validate)
- **Repo visibility**: private
- **License**: MIT (with sharmanhall + Faris Hijazi attribution preserved)

## What's done

- ✅ Merged the v5 dynamic seeder-column highlighter into the v6.0.1 enhancer
  base, in a single self-contained `RBHighlighter` IIFE module at the bottom
  of the main IIFE.
- ✅ Replaced v5's `setInterval(..., 1000)` polling with a `MutationObserver`
  on every `.lista2t > tbody`. 3-second fallback interval engages only when no
  tbody exists at attach time, with a retry loop for late-loading mounts.
- ✅ New "hide rows below threshold" filter, implemented via `data-rb-below`
  attribute + CSS rule (composes cleanly with the enhancer's existing inline
  `display:none` writes).
- ✅ Floating ⚙ settings modal (`RBSettingsPanel`), Shadow-DOM isolated, with
  live controls for the highlighter and shortcuts to existing enhancer toggles.
- ✅ Repo scaffolding: README, CHANGELOG, CONTRIBUTING, LICENSE, ESLint,
  Prettier, EditorConfig, header validator, GitHub Actions CI, Dependabot,
  issue + PR templates, docs/INSTALL + docs/SETTINGS.
- ✅ Branch protection on `main`: PR required, `ci` status check required,
  linear history, conversation resolution required.
- ✅ Milestones created: `v6.1`, `v6.2`, `v7.0`.
- ✅ Custom labels created (type / priority / area / good-first-issue).

## What's next

### v6.1 — filtering & performance
- Per-mirror settings overrides (some mirrors need a different threshold).
- Smarter throttling: skip `highlightTorrents` if no `.lista2t` mutation
  actually changed a `tr.lista2`.
- Memoize `findSeederColumnIndex()` per page until the column header DOM
  changes.

### v6.2 — UX & quality of life
- Drag-to-reposition the floating ⚙ button (corner choice persisted).
- Highlight color "swatches" preset alongside the color picker.
- Keyboard shortcut to toggle "hide rows below threshold" (e.g. `Shift+H`).
- Inline "X rows hidden" counter in the modal.

### v7.0 — stretch features
- Multiple highlight bands (e.g. `≥1000` darker green, `≥100` lighter green).
- Per-category thresholds.
- Optional minimum size filter.

## Known issues

- **The `var meta = { rawmdb: function () { ... } }` wrapper at the top of the
  file is fragile**. Prettier-formatting it can break the regex-based reflection
  at the bottom of that function. The file is `.prettierignore`d; keep it that way.
- **GM_config + live settings divergence**: enhancer toggles surfaced in the new
  modal still go through `GM_config.set/.write`, which doesn't trigger live
  application — the user has to reload to see infinite-scroll/large-thumbnail
  changes take effect. The modal shows a hint when this happens. A future
  refactor could bypass `GM_config` for these and store under `rbhl_*` directly,
  but that risks divergence from the legacy panel.
- **The `@require`d third-party libs** (jQuery, infinite-scroll, mousetrap,
  ocrad, GM_fetch, GM_config) are pinned to mid-2010s versions hosted on
  jsdelivr / raw.githubusercontent.com. If GitHub Raw rate-limits or one of
  those URLs 404s, the userscript breaks. Long-term plan: vendor them inline.

## How to resume

```bash
# clone
gh repo clone tyhallcsu/rarbg-enhancer
cd rarbg-enhancer

# install dev deps
npm install

# run the same checks CI runs
npm run ci

# make a branch
git checkout -b feat/your-thing

# edit rarbg-enhancer.user.js, bump @version, update CHANGELOG.md
# open a PR — CI must pass before merge
```

## Sources of truth

- Userscript: [`rarbg-enhancer.user.js`](rarbg-enhancer.user.js) — single file,
  all behavior lives here.
- Settings reference: [`docs/SETTINGS.md`](docs/SETTINGS.md)
- Install: [`docs/INSTALL.md`](docs/INSTALL.md)
- History: [`CHANGELOG.md`](CHANGELOG.md)
