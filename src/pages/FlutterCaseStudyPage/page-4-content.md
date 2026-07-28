# Page 4 — Product Delivered
Content brief for the content editor. This page is the fourth section of the Flutter case study, shown as a card titled "Product Delivered" with an image gallery of three product screenshots.

---

## 1. Section title
- **Current copy:** `Product Delivered`
- **Where it appears:** Large heading at the top-left of the card, next to a box icon.
- **Purpose:** Names the section — signals "here's what we actually shipped."
- **Length guidance:** Short label, 2–4 words. Long titles will wrap awkwardly at ~1.75rem font size.
- **Editable:** Yes.

## 2. Section description
- **Current copy:** `Production screens built on top of the Flutter platform.`
- **Where it appears:** One line of body copy directly under the title.
- **Purpose:** One-sentence summary of what the screenshots show.
- **Length guidance:** Keep to roughly one short sentence (~26 characters per line, wraps to 2–3 lines). Note: this line is automatically hidden on shorter desktop screens (short-height laptops), so the title alone must still make sense without it.
- **Editable:** Yes.

## 3. Screenshot captions (alt text)
These are not visible as on-screen labels — they're accessibility/alt text read by screen readers and shown as hover context. Still worth editor review since they describe the product to anyone who can't see the images.

| # | Image | Current alt text |
|---|-------|-------------------|
| 1 | Access Management Dashboard (hosteller list view) | `Access Management Dashboard — hosteller list` |
| 2 | Access Management Dashboard (student detail sheet) | `Access Management Dashboard — student detail sheet` |
| 3 | Pass Console (pass request history) | `Pass Console — pass request history` |

- **Format:** `[Screen name] — [what's shown]`
- **Length guidance:** Keep concise and descriptive; these aren't visually constrained but should stay factual.
- **Editable:** Yes.

## 4. Interaction hint
- **Current copy:** `Click to enlarge`
- **Where it appears:** Small caption below the gallery, next to an expand icon.
- **Purpose:** Tells the user the active screenshot is clickable (opens a full-size lightbox view).
- **Length guidance:** Very short — 2–4 words max, sits on one line next to an icon. Also hidden on shorter desktop screens.
- **Editable:** Yes, but should stay instructional/short (e.g. "Click to enlarge", "Tap to zoom").

---

## Not editable by content (structural, not copy)
- Number and order of screenshots (currently 3) — a dev/design change, not a content edit.
- Navigation arrows and dot indicators have icon-only, non-text labels (screen-reader labels only, e.g. "Show previous screenshot").
