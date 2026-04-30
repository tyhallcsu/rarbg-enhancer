# Settings reference

Every control exposed by the floating ⚙ modal, plus where it persists and how
it interacts with the legacy enhancer settings.

## Opening the modal

| Method | Where |
|---|---|
| Click | Green **⚙** button, bottom-right of any RARBG mirror page |
| Keyboard (legacy GM_config panel only) | `Ctrl+/` |

The modal lives inside an open Shadow Root attached to a fixed-position host
at `z-index: 2147483645`, so RARBG's own page CSS cannot leak in.

To close: **Esc**, click the dark scrim outside the modal, or click the ×
in the panel header.

## Highlight controls (apply live)

These all persist via `GM_setValue` under the `rbhl_*` namespace, separate
from the legacy `GM_config` storage. Changes take effect immediately — no
page reload needed.

### Enable highlighting

- **Storage key**: `rbhl_enabled`
- **Default**: `true`
- **Behavior**: master switch. When off, the script removes `data-rb-hl`
  and `data-rb-below` attributes from every `tr.lista2` and stops applying
  the stylesheet rule. The observer stays attached so re-enabling is instant.

### Seeder threshold

- **Storage key**: `rbhl_threshold`
- **Default**: `100`
- **Type**: integer ≥ 0
- **Behavior**: rows with seeders **≥ this value** are highlighted. Values
  are clamped via `parseInt(..., 10)`; non-numeric input falls back to the
  default.

### Highlight color

- **Storage key**: `rbhl_color`
- **Default**: `#c0edc8` (pale green)
- **Type**: CSS hex color, validated against `^#[0-9a-fA-F]{3,8}$`
- **Behavior**: applied as `background: <color> !important` to `<td>` cells
  of highlighted rows. Cell-level (not row-level) so it composes with row
  borders the mirror's own CSS may set.

### Hide rows below threshold

- **Storage key**: `rbhl_hideBelow`
- **Default**: `false`
- **Behavior**: when `true`, rows whose seeder count is **below threshold**
  get `data-rb-below="1"` and a stylesheet rule hides them. Toggling off
  removes the attribute on the next pass — rows are restored.

> **Why an attribute and not inline `display: none`?** The enhancer already
> sets inline `display: none` on rows for its own features (search filter,
> hide-empty-torrents). Using a separate attribute means the two systems
> compose: a row hidden by either remains hidden; toggling one off doesn't
> resurrect a row the other still wants hidden.

## Enhancer shortcuts (require reload)

These read/write the legacy `GM_config` storage. Because the underlying
enhancer reads them at boot, **changes only take effect after a page
reload**. The modal shows a hint when one of these toggles is changed.

| Setting | GM_config key | Default | Effect |
|---|---|---|---|
| Large thumbnails | `largeThumbnails` | `true` | Enhancer's bigger inline thumbnails. |
| Infinite scrolling | `infiniteScrolling` | `true` | Auto-load next page when you near the bottom. |
| Hide recommended torrents | `hideRecommendedTorrents` | `false` | Removes the "recommended" sidebar block. |
| Thumbnail hover sound | `thumbnailHoverSound` | `true` | Plays a click sound on thumbnail hover. |

For every other enhancer option (mirrors list, image search engine, category
blocks, deduplicate, static search bar, etc.), click **Open full settings…** in
the modal — that opens the legacy `GM_config` panel, which auto-reloads after
you save.

## Buttons

### Open full settings…
Closes the modal and calls `GM_config.open()`. Saving in that panel reloads
the page (it's how `GM_config` works upstream — we didn't add that).

### Reset highlight
Sets `rbhl_enabled = true`, `rbhl_threshold = 100`, `rbhl_color = #c0edc8`,
`rbhl_hideBelow = false`, and re-applies. Does **not** touch enhancer
settings.

## Where to find the storage values

Tampermonkey **Dashboard → script → Storage tab**. You'll see:

```
rbhl_enabled: true
rbhl_threshold: 100
rbhl_color: "#c0edc8"
rbhl_hideBelow: false
```

…alongside the enhancer's own GM_config-managed keys. You can edit them by
hand here if the modal isn't reachable for some reason.

## CSS injected by the highlighter

Just one `<style id="rbhl-style">` block, refreshed live as settings change:

```css
tr.lista2[data-rb-hl="1"] > td { background: #c0edc8 !important; }
tr.lista2[data-rb-below="1"] { display: none !important; }
```

If you want to override either rule (e.g. with a Stylus user style), use a
higher-specificity selector — the `!important` is intentional because
RARBG's own row CSS is also `!important` in places.
