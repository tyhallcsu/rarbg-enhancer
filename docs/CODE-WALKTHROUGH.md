# Code walkthrough

A reference for understanding how RARBG mirror DOM looks and how the script
hooks into it. Adapted from upstream
[FarisHijazi/Rarbg-Enhancer-UserScript `docs.md`](https://github.com/FarisHijazi/Rarbg-Enhancer-UserScript/blob/master/docs.md)
under MIT, with notes about the highlighter additions.

## A single torrent row

This is what one row in the results table (`table.lista2t > tbody > tr.lista2`)
looks like after the script has run. The two notable additions vs. raw
RARBG markup are the `thumbnail-cell` column (injected by `appendColumn()`)
and the `has-torrent-DL-ML` cell carrying the magnet/torrent shortcuts
(injected by `addDlAndMl()`).

```html
<tr class="lista2" style="background: rgba(0, 128, 0, 0.337);">
    <td align="left" class="lista" width="48" style="width:48px;">
        <a href="/torrents.php?category=45">
            <img src="https://dyncdn.me/static/20/images/categories/cat_new45.gif" border="0" alt="">
        </a>
    </td>

    <!-- injected by the enhancer's appendColumn("Thumbnails") -->
    <td class="thumbnail-cell">
        <a href="magnet:?xt=urn:btih:undefined&dn=…">
            <img class="preview-image zoom"
                 smallsrc="https://dyncdn.me/mimages/30994/over_opt.jpg"
                 bigsrc="https://dyncdn.me/mimages/30994/poster_opt.jpg"
                 src="https://dyncdn.me/mimages/30994/over_opt.jpg">
        </a>
    </td>

    <td align="left" class="lista has-torrent-DL-ML">
        <a onmouseover="return overlib('<img src=…>')"
           onmouseout="return nd();"
           href="/torrent/5xafklq"
           title="An.American.Werewolf.In.Paris.1997.720p.WEBRip.x264-ASSOCiATE">
            An.American.Werewolf.In.Paris.1997.720p.WEBRip.x264-ASSOCiATE
        </a>
        <a href="/torrents.php?imdb=tt0118604">
            <img src="…/imdb_thumb.gif" border="0" alt="">
        </a>
        <br>
        <span style="color:DarkSlateGray">
            Comedy, Fantasy, Horror, Thriller IMDB: 5.1/10
        </span>
        <a href="https://www.google.com/search?…" class="search">
            <img src="https://www.google.com/s2/favicons?domain=google.com">
            <p5>Google Image Search</p5>
        </a>
    </td>

    <!-- injected by the enhancer's addDlAndMl() -->
    <td class="lista" width="50px" align="center">
        <a class="torrent-dl" href="https://…/download.php?id=5xafklq&f=…">
            <img src="https://dyncdn.me/static/20/img/16x16/download.png">
        </a>
        <a class="torrent-ml" href="magnet:?xt=urn:btih:undefined&dn=…">
            <img src="https://dyncdn.me/static/20/img/magnet.gif">
        </a>
    </td>

    <td align="center" class="lista">2019-04-12 17:38:20<br>25min&nbsp;ago</td>
    <td align="center" class="lista">1.74 GB</td>
    <td align="center" class="lista"><font color="#008000">36</font></td>  <!-- seeders -->
    <td align="center" class="lista">42</td>                                <!-- leechers -->
    <td align="center" class="lista">--</td>
    <td align="center" class="lista">p33Rn3t</td>                           <!-- uploader -->
</tr>
```

## How the highlighter finds the seeder column

Mirrors don't always render columns in the same order. Hardcoding "seeders is
column 7" breaks on at least three of the included mirrors. The highlighter
finds it dynamically:

```js
function findSeederColumnIndex() {
    // Anchor on the column header link whose href contains "seeders".
    // Must NOT match the pager's seeder link.
    var seederLink = document.querySelector(
        '.lista2t a[href*="seeders"]:not(#pager_links a)'
    );
    if (!seederLink) return -1;
    var seederTd = seederLink.parentElement;
    while (seederTd && seederTd.tagName !== "TD") {
        seederTd = seederTd.parentElement;
    }
    var index = 0;
    while ((seederTd = seederTd.previousElementSibling) != null) index++;
    return index;
}
```

The header link looks like:

```html
<th><a href="/torrents.php?…&sort=seeders&by=DESC"><b>Seeders</b></a></th>
```

Counting `previousElementSibling` of the parent `<td>` gives the column
index, regardless of the actual position. See
[#4](https://github.com/tyhallcsu/rarbg-enhancer/issues/4) for the
proposed memoization improvement.

## How the highlighter applies color

NOT inline `row.style.background`. A single CSS rule keyed off a
`data-rb-hl="1"` attribute, refreshed live as settings change:

```css
tr.lista2[data-rb-hl="1"] > td { background: #c0edc8 !important; }
tr.lista2[data-rb-below="1"]   { display: none !important; }
```

The attribute approach lets the highlighter compose with the enhancer's own
inline `display: none` writes (search filter, hide-empty-torrents) without
clobbering them. See
[#3](https://github.com/tyhallcsu/rarbg-enhancer/issues/3) and
[#7](https://github.com/tyhallcsu/rarbg-enhancer/issues/7) for related
follow-ups.

## Where each module lives

| Region | Lines (~) | Purpose |
|---|---|---|
| Header + meta wrapper | 1–110 | UserScript metadata; reflection trick (slated for removal in [#37](https://github.com/tyhallcsu/rarbg-enhancer/issues/37)) |
| Constants + maps | 144–204 | Category code maps, search engines, blacklists |
| Main IIFE | 206–2710 | Everything user-facing |
| `GM_config.init` | 222–392 | Legacy settings panel definitions |
| `bindKeys` | 984–1140 | Mousetrap keybindings |
| `observeDocument` | 1312–1333 | MutationObserver wrapping the DOM-mutation handler |
| `addThumbnailColumn` / `addDlAndMl` / `addImageSearchAnchor` | various | Per-row column injection |
| `replaceAllImageHosts` | ~2418 | Description-thumbnail URL rewriting |
| **`RBHighlighter` IIFE** | **2244–2456** | **Seeder-column detection + highlighting + hide-below** |
| **`RBSettingsPanel` IIFE** | **2468–2710** | **Shadow-DOM floating modal** |
| Helpers (createElement, addCss, fetchDoc, …) | 2712–end | Shared utilities |

## Useful console probes

Run these in DevTools to inspect the highlighter at runtime:

```js
// What threshold is in effect?
unsafeWindow.__rbhl.settings.threshold

// Force a re-pass (useful after manual DOM edits)
unsafeWindow.__rbhl.reHighlight()

// Inspect every highlighted row
document.querySelectorAll('tr.lista2[data-rb-hl="1"]').length

// Inspect every hidden-below-threshold row
document.querySelectorAll('tr.lista2[data-rb-below="1"]').length
```

## Further reading

- [`SETTINGS.md`](SETTINGS.md) — full settings reference + storage keys
- [`INSTALL.md`](INSTALL.md) — install walkthrough with screenshots
- [`../HANDOFF.md`](../HANDOFF.md) — current state of the repo, known landmines
