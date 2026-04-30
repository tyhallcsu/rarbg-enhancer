# Contributing

Thanks for your interest in improving `rarbg-enhancer`. This is a small,
single-file userscript repo, but a few conventions keep things tidy.

## Branch naming

| Prefix | Use for |
|---|---|
| `feat/` | New user-facing capability (`feat/per-mirror-overrides`) |
| `fix/` | Bug fix (`fix/observer-detaches-after-pjax`) |
| `chore/` | Tooling, deps, refactors with no user-visible change (`chore/bump-eslint-9`) |
| `docs/` | README / CHANGELOG / docs only |

## Commit style — Conventional Commits

Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
Examples:

```
feat(modal): add per-mirror threshold overrides
fix(highlighter): re-attach observer after SPA navigation
chore(ci): bump actions/checkout to v5
docs(settings): document rbhl_color persistence
```

The optional scope corresponds to a label area: `highlighter`, `filters`,
`modal`, `performance`, `settings`, `ci`, `docs`.

## Pull request rules

Before opening a PR, every change MUST:

1. **Bump `@version`** in the `// ==UserScript== ... // ==/UserScript==`
   header. Follow [SemVer](https://semver.org/):
   - `PATCH` for fixes that don't change behavior on the happy path
   - `MINOR` for new features (highlighter additions, new modal controls)
   - `MAJOR` for breaking changes to settings keys or @include scope
2. **Update [`CHANGELOG.md`](CHANGELOG.md)** under `[Unreleased]` (or a new
   version section if you're cutting a release). Keep-a-Changelog format:
   `Added` / `Changed` / `Deprecated` / `Removed` / `Fixed` / `Security`.
3. **Pass lint + validate**:
   ```bash
   npm run ci
   ```
   CI runs the same on every PR.
4. **Test on at least one live mirror.** State which one in the PR description.
5. **Screenshots** if the change is visible (modal, row coloring, layout).

## Local testing

Two paths, pick whichever matches your editing flow.

### Path A — Tampermonkey built-in editor (fastest)

1. Tampermonkey **Dashboard → RARBG Enhancer → ✏️**.
2. Paste your edits. Save.
3. Hard-reload a RARBG mirror page.

### Path B — edit on disk + reload from file

1. Open `rarbg-enhancer.user.js` in your editor of choice.
2. In Tampermonkey **Dashboard → Utilities**, use **Import from file** (or
   drop the file onto the dashboard). Tampermonkey will store its own copy;
   re-import each time you save.
3. Some setups support `file://` or `chrome://extensions` developer-mode
   auto-reload — see Tampermonkey's FAQ for your browser.

## Style

`.editorconfig` and `.prettierrc` are the source of truth (4-space indent, LF,
double quotes, semicolons, 120-col width). Run `npm run format` before pushing.

The userscript itself is `.prettierignore`d because its `var meta = { rawmdb:
function () { ... } }` wrapper around the `// ==UserScript==` block is fragile
under formatter passes. Edit it manually with a light touch.

## Reporting bugs / feature requests

Use the issue templates in `.github/ISSUE_TEMPLATE/`. Blank issues are
disabled — the templates collect mirror, browser, and userscript-manager info,
which saves a round-trip on triage.

## License

By contributing, you agree your work is licensed under [MIT](LICENSE).
