# PUBLISH-AUDIT — rarbg-enhancer

> Read-only pre-publication audit performed 2026-04-30 against the local working tree at
> `/Users/tylerhall/Documents/GitHub/rarbg-userscript/rarbg-enhancer-repo/`,
> the `tyhallcsu/rarbg-enhancer` GitHub repo via `gh`, and the in-file metadata
> of `rarbg-enhancer.user.js`. No files were modified. Phase 2 changes are
> queued in [Recommended changes](#recommended-changes) below.

---

## 1. Repo structure

### Top-level inventory

| Path | Type | Status | Notes |
|---|---|---|---|
| `rarbg-enhancer.user.js` | file | ✅ exists | 195 KB, single-file userscript |
| `package.json` | file | ✅ exists | `version: "6.2.7"`, devDeps only |
| `package-lock.json` | file | ✅ exists | |
| `README.md` | file | ✅ exists | |
| `LICENSE` | file | ✅ exists | MIT (with attribution preamble) |
| `CHANGELOG.md` | file | ✅ exists | Keep-a-Changelog, 6.2.0 → 6.2.7 |
| `CONTRIBUTING.md` | file | ✅ exists | |
| `HANDOFF.md` | file | ✅ exists | AI-continuation doc |
| `.editorconfig` | file | ✅ exists | |
| `.eslintrc.json` | file | ✅ exists | |
| `.eslintignore` | file | ✅ exists | |
| `.prettierrc` | file | ✅ exists | |
| `.prettierignore` | file | ✅ exists | |
| `.gitignore` | file | ✅ exists | |
| `.vscode/` | dir | ✅ exists | |
| `node_modules/` | dir | ✅ exists | not in git |
| `docs/` | dir | ✅ exists | (children below) |
| `scripts/` | dir | ✅ exists | (children below) |
| `test/` | dir | ✅ exists | Playwright artifacts |
| `.github/` | dir | ✅ exists | (children below) |

### `docs/`

| File | Status | Notes |
|---|---|---|
| `docs/INSTALL.md` | ✅ exists | claimed by README — present |
| `docs/SETTINGS.md` | ✅ exists | claimed by README — present |
| `docs/CODE-WALKTHROUGH.md` | ✅ exists | claimed by README — present |
| `docs/icons/` (RARBG_Logo.png, download_button.png, tampermonkey_logo.png) | ✅ exists | 3 files |
| `docs/screenshots/` | ✅ exists | 10 files (see Section 6) |

### `scripts/`

| File | Status | Notes |
|---|---|---|
| `scripts/validate-header.js` | ✅ exists | claimed by README — present, exec bit set |

### `.github/`

| File | Status | Notes |
|---|---|---|
| `.github/workflows/ci.yml` | ✅ exists | claimed by README — lint + validate, runs on push/PR to `main` |
| `.github/ISSUE_TEMPLATE/bug_report.yml` | ✅ exists | |
| `.github/ISSUE_TEMPLATE/feature_request.yml` | ✅ exists | |
| `.github/ISSUE_TEMPLATE/config.yml` | ✅ exists | |
| `.github/PULL_REQUEST_TEMPLATE.md` | ✅ exists | |
| `.github/dependabot.yml` | ✅ exists | |

**Verdict**: No missing files relative to `README.md`'s "File layout" claims. ✅

---

## 2. Code review of `rarbg-enhancer.user.js`

### 2.1 Version / changelog sync (publish-blocker)

| Source | Value |
|---|---|
| `@version` header | `6.2.7` ✅ |
| `@name` header | `RARBG Enhancer + Highlighter (Merged) 6.2.7` ⚠ embeds version |
| `package.json` `version` | `6.2.7` ✅ |
| `README.md` version badge | `6.2.7` ✅ |
| `CHANGELOG.md` newest entry | `[6.2.7] — 2026-05-01` ✅ |
| **In-file CHANGELOG comment block** (line 82) | **`Merged build 6.2.0 (2026-04-30)`** ❌ STALE |

**Finding**: The user-context-confirmed bug is real. The in-file `/* CHANGELOG — Merged build 6.2.0 ... */` block at lines 81–126 still describes the v6.2.0 merge baseline only. It does not mention any of the 6.2.1–6.2.7 changes (FAB fix, modal redesign, switch sizing fix, legacy panel restyle, image host rules, etc.). Either:

- (A) Truncate it to a one-line pointer (`See CHANGELOG.md for the per-version history`) plus a short "vs. upstream baseline" diff, OR
- (B) Append per-version subsections matching `CHANGELOG.md`.

I recommend (A) — keeping two changelogs in sync indefinitely is ratchet pain. Treat `CHANGELOG.md` as the source of truth.

### 2.2 Header `@-fields` (one minor inconsistency)

```
@name         RARBG Enhancer + Highlighter (Merged) 6.2.7
@namespace    https://github.com/tyhallcsu/rarbg-enhancer        ✅
@version      6.2.7                                               ✅
@author       tyhallcsu
@contributor  Faris Hijazi (original author)                      ✅
@contributor  darkred                                             ✅
@contributor  sharmanhall                                         ✅
@homepageURL  https://github.com/tyhallcsu/rarbg-enhancer        ✅
@supportURL   https://github.com/tyhallcsu/rarbg-enhancer/issues ✅
@updateURL    .../raw/main/rarbg-enhancer.user.js                ✅ (works once public)
@downloadURL  .../raw/main/rarbg-enhancer.user.js                ✅ (works once public)
@icon         https://t1.gstatic.com/faviconV2?...&url=http://rarbg.to
```

- `@updateURL` and `@downloadURL` resolve correctly for a **public** repo (verified via `https://github.com/tyhallcsu/rarbg-enhancer/raw/main/rarbg-enhancer.user.js` URL shape).
- `@icon` is Google's `t1.gstatic.com` favicon proxy — external CDN, but it's a stable Google service, not user-controlled. Acceptable for now; flag as open question if you want to self-host.
- **`@contributor Cisco` is missing from the header** — `README.md` line 184 credits Cisco for "Original add magnet link idea" but no matching `@contributor` line exists. Minor consistency fix.
- **`@name` embeds the version** — open issue [#41](https://github.com/tyhallcsu/rarbg-enhancer/issues/41) per HANDOFF; not a publish-blocker but means every TM update installs as a NEW script. Recommend deferring to a follow-up PR (out of scope for the polish pass).

### 2.3 Hardcoded personal info / paths / secrets

```
$ grep -nE "(tyler@|tylerhall|/Users/|@gmail|@essremodel)" rarbg-enhancer.user.js
(no output)
```

✅ Clean. No personal info leaks.

### 2.4 Debug flags

```
261:  const debug = false;  // debugmode (setting this to false will disable the console logging)
2522: var DEBUG = false;
```

Both flags default `false`. ✅ No user-visible spam from flag-gated paths.

### 2.5 Console.log spam

**66 `console.*` calls total.** All inherited from upstream. They fire on every page load even with `debug = false`, because the log calls themselves aren't gated by the flag — only a handful are.

Notable always-on calls:
```
162: console.log("Script:", meta.name, "meta:", meta);
850: console.log("Rarbg threat defence page");
1032: console.log("is first visit");
1139: console.log("loaded");
1180: console.log("opening all mirrors");
1493: console.log("solving captcha...");
1867: console.log("toggleThumbnailSize(" + newSize + ")");
```

Open issue [#12 "Gate console logs behind DEBUG flag"](https://github.com/tyhallcsu/rarbg-enhancer/issues/12) tracks this. **Out of scope for a polish pass per task constraints** ("Don't refactor working code"). Flag for awareness; ship as-is.

### 2.6 imgur / external CDN refs

```
229: const ICON_DESCRIPTION_WIDE  = "https://i.imgur.com/xreLTXq.gif";
230: const ICON_DESCRIPTION_TALL  = "https://i.imgur.com/6gG2QGj.gif";
231: const ICON_THUMBNAILS_WIDE   = "https://i.imgur.com/9xh3vuU.gif";
232: const ICON_THUMBNAILS_TALL   = "https://i.imgur.com/XMV45fY.gif";
233: const ICON_THUMBNAILS        = "https://i.imgur.com/nA2dRWu.gif";
234: const ICON_DESCRIPTION       = "https://i.imgur.com/UxbSq2o.gif";
235: const ICON_MORE_BLUE         = "https://i.imgur.com/FGwOuVT.gif";
236: const ICON_EXTRA_GREEN       = "https://i.imgur.com/HU6J9kS.gif";
```

Eight inherited imgur-hosted UI icons. Listed as **open question** — self-hosting these into `docs/icons/` and rewriting the constants to use the github raw URL (or inlining as base64) is a dedicated PR's worth of work. Risk if left: imgur could nuke the account or rate-limit; icons would 404. Not a publish-blocker today.

### 2.7 TODO / FIXME / debug crumbs (user-visible)

```
675:  // FIXME: maybe update this later
1308: solveCaptcha(); // TODO: remove this, this is just for debugging
1347: // TODO: remove rarbgprx.org and put something more general
1577: // TODO:maybe generalize this function ...
2059: // FIXME: .slice(0) add an option for this later instead of forcefully only using a single image
3350: rg_meta.st = siteAndNameInfo[183836587][0]; // infolink TODO: doublecheck
3353: rg_meta.st = siteAndNameInfo[2003][2];      // infolink TODO: doublecheck
```

All inherited from upstream. **None are user-visible** — they're code-comment cruft only. OK to leave for the polish pass.

### 2.8 `@require` library URLs

```
https://code.jquery.com/jquery-3.4.0.min.js                                              ✅ stable
https://unpkg.com/infinite-scroll@3.0.5/dist/infinite-scroll.pkgd.min.js                 ✅ pinned
https://raw.githubusercontent.com/ccampbell/mousetrap/master/mousetrap.min.js            ⚠ depends on master
https://raw.githubusercontent.com/mitchellmebane/GM_fetch/master/GM_fetch.js             ⚠ depends on master
https://raw.githubusercontent.com/antimatter15/ocrad.js/master/ocrad.js                  ⚠ depends on master
https://raw.githubusercontent.com/sizzlemctwizzle/GM_config/2207c5c1322ebb56e401f03c2e581719f909762a/gm_config.js  ✅ commit-pinned
```

3 of 6 require URLs depend on `master` and would silently break if upstream renames the branch. HANDOFF.md §5 already documents this as a known landmine. **Out of scope for the polish pass** — would require pinning to commit SHAs and re-validating each lib. Not a publish-blocker (works today).

---

## 3. GitHub state

### 3.1 Repo metadata (`gh repo view`)

```json
{
  "name": "rarbg-enhancer",
  "url": "https://github.com/tyhallcsu/rarbg-enhancer",
  "visibility": "PRIVATE",
  "isPrivate": true,
  "defaultBranchRef": { "name": "main" },
  "description": "Tampermonkey userscript for RARBG mirrors — seeder-based row highlighting, filtering, and a floating settings modal.",
  "homepageUrl": "",
  "licenseInfo": { "key": "other", "name": "Other", "nickname": "" },
  "repositoryTopics": [
    "greasemonkey", "javascript", "rarbg",
    "tampermonkey", "userscript", "violentmonkey"
  ]
}
```

| Field | Value | Action |
|---|---|---|
| `visibility` | `PRIVATE` | **Flip to public** before / as part of release |
| `description` | already set ✅ | none |
| `repositoryTopics` | already set ✅ (6 topics) | none |
| `homepageUrl` | `""` (empty) ❌ | **Set** to install raw URL |
| `licenseInfo.key` | `other` ❌ | GitHub's detector misses MIT because `LICENSE` has 8 lines of attribution preamble before SPDX boilerplate. Either accept "Other" or strip the preamble (don't recommend — preserves attribution). |
| `defaultBranchRef` | `main` ✅ | none |

### 3.2 Pull requests

```
=== OPEN ===
#54 [historical] fix/switch-size-legacy-esc-close — squashed into #47 (DRAFT)
#53 [historical] fix/page-world-listener-injection — squashed into #44 (DRAFT)
#52 [historical] fix/fab-modal-redesign-and-cheap-bugs — squashed into #40 (DRAFT)
#51 [historical] fix/fab-document-level-listener — squashed into #43 (DRAFT)
#50 [historical] fix/auto-scroll-and-settings-restyle — squashed into #39 (DRAFT)
#49 [historical] feat/upstream-assets-and-update-urls — squashed into #38 (DRAFT)
#48 [historical] feat/switch-credits-legacy-redesign — squashed into #46 (DRAFT)
#3  chore(deps)(deps-dev): bump eslint from 8.57.1 to 10.2.1 (OPEN)

=== CLOSED (recent) ===
#55 docs(handoff): refresh HANDOFF.md (MERGED 2026-05-01)
#47 fix: switch size regression + ... v6.2.7 (MERGED)
#46 feat(modal+legacy-panel): clickable switches ... v6.2.6 (MERGED)
... (everything through v6.2.0 MERGED)
```

- 7 historical DRAFT PRs (#48–#54) are reference snapshots only — HANDOFF says "safe to close + delete branches". **Optional cleanup**, not a publish-blocker.
- **#3 (eslint 8 → 10) is held** — eslint 9+ requires flat-config migration that would break `npm run lint`. HANDOFF documents this. Don't merge; either close-with-comment or leave open.

### 3.3 Issues

29 issues total: 11 closed, 18 open. None are publish-blockers. Priority tags suggest:
- `priority:high` open: none (all the high-pri ones are closed via the v6.2.x cycle)
- `priority:medium` open: #12 console.log gating, #13/#14 modal color UX, #17 keyboard shortcuts, #18 seen/ignore, #19 magnet copy, #36 image-host rules (now done? — check), #41 drop version from `@name`, #45 surface counts outside modal
- `priority:low` open: rest

**Note**: HANDOFF.md table lists `#36` as "done in 6.2.3" but `gh issue list` still shows `#36` as `OPEN`. Either close it manually or fix HANDOFF. (Listed as recommended polish.)

### 3.4 CI

```
Workflows:
  ci                 active  268812208
  Dependabot Updates active  268812273

Recent runs (all 8 of last 8): ✅ success
```

CI is healthy. Last run 2026-05-01T01:16:58Z on `main` after the HANDOFF refresh merge.

### 3.5 Local branch state

- Current local branch: `chore/handoff-refresh` (commit `e827fb3`)
- Remote `origin/chore/handoff-refresh` was **deleted** (PR squash-merged as `5099f74`); local branch is dangling.
- Local `main` is **2 commits behind** remote `main` (`5099f74` vs local `d4537b1`).
- 6 other stale local feature branches (`feat/*`, `fix/*`) all merged to remote `main`. Optional cleanup.

**Action before phase 2 work**: `git checkout main && git pull origin main`, then branch from up-to-date `main`.

---

## 4. Docs accuracy

### 4.1 README.md cross-links

| Link | Target | Status |
|---|---|---|
| `docs/INSTALL.md` | exists ✅ | OK |
| `docs/SETTINGS.md` | exists ✅ | OK |
| `LICENSE` | exists ✅ | OK |
| `rarbg-enhancer.user.js` | exists ✅ | OK |
| `docs/icons/{tampermonkey_logo,download_button}.png` | exist ✅ | OK |
| `docs/screenshots/Screenshot_Rarbg_general.png` (hero) | exists ✅ | will be **replaced** in phase 2 per task |
| `docs/screenshots/Screenshot_auto-captcha.gif` | exists ✅ | OK |
| `docs/screenshots/infinit-scroll.gif` | exists ✅ | OK (typo "infinit" preserved from upstream) |
| `docs/screenshots/Screenshot_thumbnails-before-after.gif` | exists ✅ | OK |
| `docs/screenshots/extra_thumbnails.gif` | exists ✅ | OK |
| `docs/screenshots/Screenshot_Rarbg_mirrorDropdown.png` | exists ✅ | OK |
| `docs/screenshots/Screenshot_Rarbg_download_all_torrents.png` | exists ✅ | OK |

**Stale content**:
- README line 71: `> Auto-update note (private repos):` — must be removed/rewritten when public flips.
- INSTALL.md line 38: `> Auto-update note (private repo):` — same; second copy of the caveat.
- INSTALL.md line 50: references `#34` as "tracked for a redesign" — but #34 is **CLOSED** (done in v6.2.6). Stale.
- CODE-WALKTHROUGH.md line 105: references `#4` (cache column index) — `#4` is **not an issue** (issues start at #11; #1–#10 are PRs). Likely stale numbering from a planning doc.
- CODE-WALKTHROUGH.md line 121–122: references `#3` and `#7` — neither are issues; #3 is the open eslint PR.
- CODE-WALKTHROUGH.md line 129: references `#37` (drop reflection wrapper) — `#37` is OPEN ✅ correct.

### 4.2 HANDOFF.md cross-links

HANDOFF table (lines 64–73) lists "highest-priority quick wins" with ✅ checkmarks for `#6`, `#7`, `#34`, `#42`, `#36`. None of `#6` / `#7` exist as issues; `#36` is still OPEN per current `gh issue list` despite the ✅. Either reconcile the issue numbers or close `#36` if the upstream port is genuinely done.

---

## 5. Attribution

Cross-checked credits across `LICENSE`, in-file `@contributor` headers, README "Credits", and CHANGELOG.

| Person | LICENSE | Userscript header | README Credits | CHANGELOG | Consistent? |
|---|---|---|---|---|---|
| **sharmanhall** (v5 highlighter) | ✅ MIT © 2026 sharmanhall | ✅ `@contributor sharmanhall` | ✅ | ✅ | ✅ |
| **Faris Hijazi** (RARBG Enhancer 6) | ✅ named as base author | ✅ `@contributor Faris Hijazi` | ✅ | ✅ | ✅ |
| **darkred** (helper code, magnet links) | not named | ✅ `@contributor darkred` | ✅ | ✅ | ⚠ missing in LICENSE |
| **Cisco** (original "add magnet link" idea) | not named | ❌ NOT in `@contributor` | ✅ | ❌ NOT in CHANGELOG | ⚠ inconsistent |
| **tyhallcsu** (this fork) | not named | ✅ `@author tyhallcsu` | ✅ | implicit | OK (it's the fork author) |

**Recommended**: add `@contributor Cisco (original "add magnet link" idea — https://greasyfork.org/en/users/16455-cisco)` to the userscript header so all four upstream contributors are credited consistently. Optionally also mention darkred and Cisco in `LICENSE` "Portions of this work derived from..." preamble (but LICENSE is light on per-name attribution by design — ok to leave).

---

## 6. Screenshot inventory

### `docs/screenshots/` — 10 files

| File | Origin | Used in |
|---|---|---|
| `Screenshot_Rarbg_general.png` (370 KB) | **upstream** (FarisHijazi) | README hero (will be replaced), INSTALL.md verify section |
| `Screenshot_auto-captcha.gif` (234 KB) | **upstream** | README features |
| `Screenshot_thumbnails-before-after.gif` (98 KB) | **upstream** | README features |
| `extra_thumbnails.gif` (438 KB) | **upstream** | README features |
| `infinit-scroll.gif` (374 KB) | **upstream** | README features |
| `Screenshot_Rarbg_mirrorDropdown.png` (16 KB) | **upstream** | README features |
| `Screenshot_Rarbg_download_all_torrents.png` (30 KB) | **upstream** | README features |
| `options_button.png` (29 KB) | **upstream** | INSTALL.md (legacy options-button shot) |
| `rarbg-options-page.png` (92 KB) | **upstream** | INSTALL.md (legacy GM_config panel) |
| `rarbg-options.png` (18 KB) | **upstream** | not currently referenced — orphan? |

All current screenshots are upstream-inherited. **Zero original-to-this-fork screenshots are committed** despite the floating modal being the headline feature.

### `docs/icons/` — 3 files

| File | Origin | Used in |
|---|---|---|
| `RARBG_Logo.png` (5 KB) | **upstream** | not currently referenced |
| `download_button.png` (3 KB) | **upstream** | README, INSTALL.md |
| `tampermonkey_logo.png` (23 KB) | **upstream** | README, INSTALL.md |

### Uploads to import (located via local search)

The three CleanShot screenshots referenced in the task brief live in CleanShot's app-support directory, not at `/mnt/user-data/uploads/` (that path doesn't exist on this macOS host):

| Source path | What it shows | Suggested target |
|---|---|---|
| `~/Library/Application Support/CleanShot/media/media_rAIX4OjwyW/CleanShot 2026-04-30 at 19.16.18@2x.png` | **HERO** — floating Shadow-DOM modal open on rargb.to with live counter pills (200 rows / 12 highlighted / 188 hidden), all toggles visible, redesigned legacy panel behind | `docs/screenshots/floating-settings-modal-hero.png` |
| `~/Library/Application Support/CleanShot/media/media_jCwMyvgYrO/CleanShot 2026-04-30 at 19.17.26@2x.png` | repo file-tree view | reference only, not committed |
| `~/Library/Application Support/CleanShot/media/media_11ut6W58By/CleanShot 2026-04-30 at 19.17.45@2x.png` | rendered README config table + supported-mirrors section | reference only, not committed |

---

<a name="recommended-changes"></a>
## 7. Recommended changes (ordered by priority)

### Publish-blockers — must fix before going public

1. **Sync the in-file CHANGELOG block** (`rarbg-enhancer.user.js` lines 81–126). Either truncate to a "see CHANGELOG.md" pointer, or rewrite to reflect 6.2.x through 6.2.7.
2. **Remove the "Auto-update note (private repos)" caveat** from `README.md` line 71, and **the parallel caveat** in `docs/INSTALL.md` line 38. Replace with a one-line "Tampermonkey will auto-update on its check interval (default: daily)" note.
3. **Replace the README hero image**. Copy the floating-modal HERO screenshot to `docs/screenshots/floating-settings-modal-hero.png`, swap it in for `Screenshot_Rarbg_general.png` at README line 15, add descriptive alt text.
4. **Add a "Floating Settings Modal" subsection** to README under "New in this fork (6.2.x)" — call out the live counter pills, live-apply, Esc / Ctrl+/ shortcuts, and Shadow-DOM isolation. Reference the new hero image.
5. **Set repo `homepageUrl`** via `gh repo edit --homepage <raw-install-URL>`.
6. **Flip repo to public** via `gh repo edit --visibility public --accept-visibility-change-consequences`. (Confirm with user before running.)

### Polish — should fix before publish

7. **Add `@contributor Cisco` to the userscript header** to match README's Credits block.
8. **Fix INSTALL.md line 50** stale reference to issue #34 (it's CLOSED, done in v6.2.6).
9. **Bump `[Unreleased]` → `[6.2.7]` is already correct in CHANGELOG.md** — but consider adding a brief `[6.2.8]` or new `[Unreleased]` entry if you want phase 2 changes to land as a discrete release. Otherwise, append phase-2 doc-only changes to the existing `[6.2.7]` block (less ceremony).
10. **CHANGELOG.md `[Unreleased]` link at line 259** points at `compare/v6.2.7...HEAD` — already correct.
11. **Reconcile HANDOFF.md / CODE-WALKTHROUGH.md stale issue numbers** — `#3`, `#4`, `#6`, `#7` aren't issues; either remap to the actual numbers (`#27`, `#28`, `#29`, `#30`, etc.) or scrub the references.

### Nice-to-have — defer to follow-up PRs

12. **Close issue #36** if the upstream image-host rules port is truly done (per CHANGELOG it shipped in v6.2.3).
13. **Close the 7 historical draft PRs** (#48–#54) and delete their branches. They're reference snapshots only.
14. **Resolve dependabot PR #3** (eslint 8 → 10) — either close-with-comment ("requires flat-config migration") or migrate the config first.
15. **Address open issue #41** (drop version from `@name`) — one-line change, eliminates "every version installs as a new TM script" friction. Could roll into the same release.
16. **Address open issue #12** (gate console.log behind DEBUG flag) — quality-of-life for end users.
17. **Self-host the 8 imgur-hosted UI icons** (lines 229–236) into `docs/icons/` to remove external CDN dependency.

---

## 8. Open questions for user judgment

> Stop and ask the user about these before phase 2 — they're judgment calls, not mechanical fixes.

1. **Single release or split?** The polish phase 2 is mostly docs (hero image, README subsection, CHANGELOG, caveat removal). Do you want this to:
   - (A) Land as bumpless "polish" appended to the existing `[6.2.7]` block, OR
   - (B) Cut a `6.2.8` release (bump `@version` + `package.json` + `CHANGELOG.md`), OR
   - (C) Cut a meaningful `6.3.0` (incorporate issues #41, #12 alongside the docs work)?
   - **Default if no answer**: (B) `6.2.8` — keeps the version monotonic, doesn't bundle scope-creep.

2. **In-file CHANGELOG block**: truncate to a one-liner pointer to `CHANGELOG.md` (cleaner, single source of truth), OR rewrite as a synced full per-version log (more work, more maintenance burden)? **Default**: truncate.

3. **Repo visibility flip**: do you want me to flip `private → public` via `gh repo edit` as part of phase 2, or do you want to do that yourself by hand after reviewing? **Default**: don't flip — leave that to you.

4. **`@name` version embedding (#41)**: in scope for this release or defer? It's one line and would eliminate the TM "duplicate script per version" friction.

5. **imgur icons**: keep externally hosted, or self-host into `docs/icons/`? Self-hosting is ~30 mins of work + commit, but bulletproofs against imgur outages. **Default**: leave as-is, flag in a follow-up issue.

6. **Local branch cleanup**: there are 7 stale local feature branches (`feat/*`, `fix/*`) that were squash-merged. OK to delete locally, or leave for forensic reference?

---

## 9. Phase 2 deliverable preview

If you say "go" with the **defaults above**, phase 2 will produce these atomic commits on a new branch `release/v6.2.8-public-prep`:

```
1. chore(version): bump @version, package.json, README badge to 6.2.8
2. docs(changelog): add 6.2.8 release notes
3. docs(userscript): truncate in-file CHANGELOG block to pointer
4. chore(userscript): add @contributor Cisco to header
5. docs(readme): replace hero image with floating-modal screenshot
6. docs(readme): add Floating Settings Modal feature section
7. docs(install,readme): drop private-repo caveat, document auto-update
8. docs(install): unstale reference to closed issue #34
9. chore(github): set homepageUrl via gh repo edit
```

I will **not** push, will **not** open a PR, and will **not** flip visibility. Branch sits local for your review.

---

*Audit performed by Claude Opus 4.7 — 2026-04-30. Sources: filesystem read of working tree, `gh` CLI for repo state, grep over `rarbg-enhancer.user.js` for code-review checks. No edits to working tree files.*
