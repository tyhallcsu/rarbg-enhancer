# Install

A walkthrough for getting `rarbg-enhancer` running in your browser. If you've
installed userscripts before, the [README's one-click install](../README.md#one-click-install)
is faster.

## 1. Pick a userscript manager

Both options are free, open source, and work on every major browser.

| Manager | Browsers | Link |
|---|---|---|
| **Tampermonkey** | Chrome, Edge, Firefox, Safari, Opera | <https://www.tampermonkey.net/> |
| **Violentmonkey** | Chrome, Edge, Firefox | <https://violentmonkey.github.io/> |

Tampermonkey is the more common pick and what this script is primarily tested
against, but Violentmonkey works.

> **Chrome / Edge users**: enable **Developer mode** in
> `chrome://extensions` (or `edge://extensions`) before the manager will let
> arbitrary userscripts run. This is a Chrome/Edge requirement, not ours.

![placeholder — Chrome dev mode toggle](screenshot-dev-mode.png)

## 2. Install the script

### One-click (recommended)

Click the install link:

👉 **[Install rarbg-enhancer.user.js](https://github.com/tyhallcsu/rarbg-enhancer/raw/main/rarbg-enhancer.user.js)**

Your manager will detect the userscript and show its install screen, listing
the metadata, `@require`d libraries, and `@grant`s. Review and click **Install**.

![placeholder — Tampermonkey install dialog](screenshot-install-dialog.png)

### From a downloaded copy

1. Download [`rarbg-enhancer.user.js`](../rarbg-enhancer.user.js) (or `git clone`
   the repo).
2. **Tampermonkey** → **Dashboard** → **Utilities** → **Import from file** →
   pick the `.user.js` file. Or simply drag the file onto the Tampermonkey
   dashboard tab.
3. **Violentmonkey** → **Dashboard** → **+** → **Install from URL or file**.

![placeholder — Tampermonkey dashboard](screenshot-dashboard.png)

## 3. Verify it's running

1. Visit any RARBG mirror (see the [supported list](../README.md#supported-mirrors)).
2. You should see:
   - A green **⚙** floating button bottom-right.
   - A green **⚙ Script Settings** tab in the page navbar.
   - Rows with seeders ≥ 100 highlighted in pale green.

![placeholder — running on a torrents.php page](screenshot-running.png)

If nothing happens:
- Check Tampermonkey's icon — it should show "1" (or higher) for the active
  tab. If it shows "0", the `@include` block didn't match this URL. Open an
  issue with the URL.
- Open DevTools console (`F12` → Console). Search for `Script:` — the script
  logs its meta block on every page it runs on.

## 4. Updates

The userscript header points `@updateURL` at this repo's `main` branch raw URL.
Tampermonkey will check for updates on its own schedule (default: once a day).

To check now: **Tampermonkey Dashboard** → **Installed Userscripts** →
**Last Updated column** → click the time → **Check for Updates**.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Floating ⚙ button missing | Mirror not in `@include` list. File an issue. |
| Highlight not applying | Threshold too high, or seeder column not detected. Open the modal → confirm threshold; reload page; check console for `[RBHighlighter]` warnings. |
| "Open full settings…" reloads page on save | Expected. The legacy `GM_config` panel always reloads on save. The modal's own controls (threshold, color, hide-below, enable) apply live without reload. |
| Script doesn't update | Manually re-install via the one-click link above. Confirm `@updateURL` matches your fork. |
