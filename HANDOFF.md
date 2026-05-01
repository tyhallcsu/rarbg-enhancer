# HANDOFF — rarbg-enhancer

> Living doc for resuming work on this repo (or handing off to another AI session). Update on every meaningful change. If something here is stale, fix it before doing anything else.

## Current state — 2026-05-01

- **Version shipped**: `6.2.7`
- **Branch**: `main`
- **CI status**: passing (lint + header validate)
- **Repo visibility**: private
- **License**: MIT (sharmanhall + Faris Hijazi attribution preserved)
- **Working tree**: clean
- **Open in-flight PRs**: 7 historical drafts (#48–#54, see below) + 1 dependabot eslint upgrade #3 (held — see "Known landmines")

## Quick orientation for a fresh AI session

```bash
# Clone
gh repo clone tyhallcsu/rarbg-enhancer
cd rarbg-enhancer
npm install

# Run the same checks CI runs (must pass before any PR)
npm run ci

# Make a branch
git checkout -b fix/your-thing
# edit rarbg-enhancer.user.js, bump @version (and package.json + README badge), update CHANGELOG.md
# open PR — CI must pass before merge
```

**Repo layout**: see README. The userscript is a single `rarbg-enhancer.user.js` (~3500 lines). All behavior lives there. The `test/artifacts/` dir holds Playwright-driven verification screenshots from prior sessions.

## Version arc — what shipped when

| Version | PR | Highlights |
|---|---|---|
| 6.2.0 | (initial) | Seed of the merged userscript: v5 highlighter + RBHighlighter IIFE + RBSettingsPanel modal |
| 6.2.1 | [#38](https://github.com/tyhallcsu/rarbg-enhancer/pull/38) | Imported upstream screenshots/icons, fixed broken `@updateURL`/`@downloadURL` |
| 6.2.2 | [#39](https://github.com/tyhallcsu/rarbg-enhancer/pull/39) | Auto-scroll fix for filter-shrunk pages, GM_config panel restyle (closes #34) |
| 6.2.3 | [#40](https://github.com/tyhallcsu/rarbg-enhancer/pull/40) | First attempt at the FAB-doesn't-fire bug — moved listener to shadow root, didn't actually fix it. Cheap bugs #6 / #7 / #36 done |
| 6.2.4 | [#43](https://github.com/tyhallcsu/rarbg-enhancer/pull/43) | Second attempt at FAB bug — moved to document level. Still didn't work |
| 6.2.5 | [#44](https://github.com/tyhallcsu/rarbg-enhancer/pull/44) | **Third + final FAB fix**: register listener in PAGE WORLD via injected `<script>`. Sandbox-registered listeners don't receive cross-shadow click events under `@grant unsafeWindow` |
| 6.2.6 | [#46](https://github.com/tyhallcsu/rarbg-enhancer/pull/46) | Switch click forwarding (`<span>` → `<label>`), modal credits, legacy panel dark redesign with custom toggle switches via `appearance: none` |
| 6.2.7 | [#47](https://github.com/tyhallcsu/rarbg-enhancer/pull/47) | Switch sizing regression fix (the `.row label` rule was stretching switches). Esc-to-close + × button on legacy panel. Iframe sized to actually fit viewport |

## Architecture cheat-sheet

The userscript wraps everything in a main IIFE. Key modules at the bottom:

- **`RBHighlighter`** (~line 2244 of v6.2.7) — finds the seeder column dynamically (`.lista2t a[href*="seeders"]`), tags qualifying rows with `data-rb-hl="1"` and below-threshold rows with `data-rb-below="1"`. Pass is idempotent (wipes attrs first, retags). Uses MutationObserver on every `.lista2t > tbody`. Exposes `unsafeWindow.__rbhl = { settings, apply, reHighlight }`.
- **`RBSettingsPanel`** (~line 2664+) — Shadow-DOM modal. Builds DOM via `innerHTML` of a scaffold then moves children into the shadow root. Click delegation registers in PAGE WORLD via injected `<script>` (see "Known landmines" below). Exposes `unsafeWindow.__rbhlPanel = { open, close, toggle, isOpen, refreshCounter, dispatchAction, dispatchSetting }`.
- **`GM_config.init({ css, events, fields })`** (~line 286+) — legacy panel. The `css` field redesigns the iframe contents. The `events.open(doc)` callback injects the × close button. Outer iframe element is restyled via `addCss()` in the parent doc (see "Outer iframe" comment near line 731).
- **InfiniteScroll** — set up around line 786, exposed as `unsafeWindow.__infScroll` for `RBHighlighter.ensureScrollable()` to poke when filtering shrinks the page below the viewport.

Settings storage uses two namespaces:
- `rbhl_*` keys via `GM_setValue` — highlighter-specific (threshold, color, hideBelow, autoScrollAssist, enabled). Live-applied.
- `GM_config` storage — legacy enhancer toggles (largeThumbnails, infiniteScrolling, etc.). Reload-required.

## What's open / next

### Highest-priority quick wins (all under 50 LoC each)

| Issue | Title | Why it matters |
|---|---|---|
| **#41** | Drop version from `@name` | Each version still installs as a NEW script in TM (because TM keys on namespace+name). Fix is one line. **Eliminates the manual "disable old version" friction tax** that has been blocking smooth iteration |
| #6 | Switch `background:` shorthand to `background-color:` | ✅ done in 6.2.3 (close issue) |
| #7 | Idempotent highlight pass | ✅ done in 6.2.3 (close issue) |
| #34 | Restyle legacy panel | ✅ done in 6.2.6 (auto-closed via #46) |
| #42 | FAB click broken | ✅ done in 6.2.5 (auto-closed via #44) |
| #36 | Port upstream image-host rules | ✅ done in 6.2.3 (close issue) |
| #11 | Page summary bar above results | ✅ partially done — counter pills inside modal in 6.2.3. The "above the results table" version isn't done. Could close + dupe to #45 |
| #45 | Surface counts outside the modal (FAB tail or floating widget) | New feature request from 6.2.6 review. 4 design options spelled out in issue body. Recommended: Option A (FAB tail) |

### Open issues by milestone

- **v6.1 — filtering & performance**: #4 cache column index, #5 fake gradient decision, #8 multi-criteria filter, #9 client-side sort, #10 saved presets, #12 DEBUG flag toggle, #41 (above)
- **v6.2 — UX & QoL**: #13–#21 (color tier UX, color-blind palettes, dark mode, keyboard shortcuts, seen/ignore list, etc.), #45 (above)
- **v7.0 — stretch**: #22 anti-spam, #23 IMDb/TMDb enrichment, #24 export, #25 per-category presets

`gh issue list -R tyhallcsu/rarbg-enhancer --state open --limit 50` for the live view.

## Known landmines

These are the non-obvious gotchas I (and a successor) need to remember:

1. **Sandbox event-listener bridging is broken for cross-shadow click events under `@grant unsafeWindow`.** Listeners registered from the userscript's TM sandbox don't receive click events that originate inside our shadow root, regardless of where the listener is attached (FAB element, shadow root, document — none work). The fix: register handlers from PAGE WORLD via an injected `<script>` element that calls back into the sandbox via the exposed `unsafeWindow.__rbhlPanel.dispatch*` API. This is documented in v6.2.5's commit message and the in-file comment block above the script-injection code (~line 2900). **Don't try to "simplify" by going back to direct `addEventListener` on shadow elements.** Three versions and a Playwright debugging session were spent learning this.

2. **The `var meta = { rawmdb: function () { ... } }` wrapper at the top of the file is fragile.** Prettier-formatting it can break the regex-based reflection at the bottom of that function (which extracts `@include` URLs from comment text). The file is `.prettierignore`d AND `.eslintignore`d for this reason. #37 tracks dropping the wrapper entirely (matches what upstream did in their commit `1dffea4`).

3. **Each version installs as a NEW script in TM** because `@name` includes the version (`RARBG Enhancer + Highlighter (Merged) 6.2.7`). TM keys on namespace+name. **Until #41 lands, every fix-and-verify cycle requires manually disabling the previous version in the TM dashboard.** This is the highest-priority quick win available.

4. **GM_config save() always reloads the page.** The legacy panel's `Save` button calls `events.save` which we have set to `location.reload()`. This is upstream's design — the new floating modal exists partly to avoid this for highlighter settings.

5. **The `@require`d third-party libs** (jQuery, infinite-scroll, mousetrap, ocrad, GM_fetch, GM_config) are pinned to mid-2010s versions hosted on jsdelivr / raw.githubusercontent.com. If those URLs 404 or rate-limit, the userscript breaks. Long-term: vendor inline.

6. **uBlock Origin Lite is installed in the saved Playwright profile** at `~/.cache/playwright-tampermonkey-profile/` — handy because RARBG mirrors are ad-heavy. The profile snapshot is documented in `~/.claude/skills/playwright-tampermonkey/SKILL.md`.

7. **Free-tier private repos can't have branch protection.** `gh api .../branches/*/protection` returns 403. Both legacy branch protection and the newer Rulesets API are gated. Either upgrade to GitHub Pro or make the repo public to enable. Documented in the original repo-bootstrap report.

## Testing — Playwright + Tampermonkey

The skill at `~/.claude/skills/playwright-tampermonkey/` documents:
- Two approaches (real Tampermonkey + saved profile, vs. addInitScript with GM_* shim)
- Diagnostic snippets for "listener doesn't fire" bugs (in `diagnostics.js`)
- A runner script for headless CI-style verification
- A `restore-profile.sh` for restoring the Tampermonkey + uBlock profile

Saved profile: `~/.cache/playwright-tampermonkey-profile` (~128 MB)
Active MCP profile: `~/Library/Caches/ms-playwright/mcp-chrome-XXXXXX/` (hash-suffixed, latest one wins)

## In-flight PRs as of this writing (2026-05-01)

- **#48–#54** — historical draft PRs for the 7 squashed-merged feature branches. Reference snapshots only; safe to close + delete branches.
- **#3** — dependabot bump eslint 8 → 10. **Held**: eslint 9+ requires flat config (`eslint.config.js`); merging this without migrating breaks `npm run lint`. Fix path: either migrate config first OR keep eslint 8.
- **#1, #2** — dependabot bumps for actions/checkout and actions/setup-node — already merged.

## How to resume

If you're a successor AI session, start with:

1. `gh issue list -R tyhallcsu/rarbg-enhancer --state open --limit 50` — what's open
2. `gh pr list -R tyhallcsu/rarbg-enhancer --state open` — what's in flight (mostly the 7 historical drafts; ignore those)
3. **#41 is the obvious next move.** One-line change. Removes blocker. Then everything else iterates more smoothly.
4. After #41: pick from v6.1 milestone issues. The "cheap bugs" labeled `priority:medium` or `priority:high` with small scope are best.

## Sources of truth

- Userscript: [`rarbg-enhancer.user.js`](rarbg-enhancer.user.js) — single file, all behavior
- Settings reference: [`docs/SETTINGS.md`](docs/SETTINGS.md)
- Install: [`docs/INSTALL.md`](docs/INSTALL.md)
- Code walkthrough: [`docs/CODE-WALKTHROUGH.md`](docs/CODE-WALKTHROUGH.md)
- History: [`CHANGELOG.md`](CHANGELOG.md)
- Conventions: [`CONTRIBUTING.md`](CONTRIBUTING.md)
- Playwright testing: `~/.claude/skills/playwright-tampermonkey/SKILL.md`
