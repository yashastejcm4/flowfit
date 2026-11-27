# Flowfit design guideline

One look across every screen. If something new doesn't fit these rules, change the rule here first.

## Colour
| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg` | #0A0A0A | #F4F4F1 | Page background, status bar, launch screen |
| `--surface` | #171717 | #FFFFFF | Cards, lists, nav buttons |
| `--surface-2` | #212121 | #EFEFEB | Things inside a card: fields, chips, stat boxes, set rows |
| `--surface-3` | #2C2C2C | #E2E2DC | Things inside those: stepper buttons |
| `--accent` | #DCF25B | #DCF25B | The one thing that matters: main button, selected item, current tab, progress |
| `--accent-ink` | #0F0F0F | #0F0F0F | Text and icons on lime |
| `--muted` / `--faint` | #9A9A9A / #5F5F5F | #6D6D68 / #A5A5A0 | Hints and secondary text |

Rules: surfaces are flat (no gradients, borders, bevels or inner shadows). One lime element leads each screen; everything else stays grey. On a lime card, the button is black.

## Type (Inter, bundled in the app)
| Role | Size / weight |
|---|---|
| Page title | 26 / 700 |
| Greeting / profile name | 24–26 / 700 |
| Section title | 18 / 600 |
| Card title | 17 / 600 |
| Row title | 15 / 600 |
| Body | 15 / 400 |
| Hint under a row | 13 / 400, muted |
| Small label (stats, uppercase tags) | 11–12 / 500–600 |
Numbers use tabular figures. Headings get slight negative tracking (−0.02em).

## Spacing (always from the scale)
Scale: **4 · 8 · 12 · 16 · 24 · 32**.
- Page sides: 16
- Between cards: 12
- Section title: 24 above, 12 below
- Inside a card or list: 16 all round
- List rows: 14 top and bottom, at least 60 tall, dividers inset to the text
- Chips and small controls: 8 apart

## Shape
- Cards and lists: 22 radius. Inner boxes: 16. Buttons, chips, fields and toggles: fully round.
- Icon buttons and nav buttons: circles (46 and 56).

## Icons
24×24 grid, 1.75 stroke, round caps and joins, no fills (the current nav icon is drawn at 2.1). Sizes: 16 next to small text, 20 in rows and buttons, 24 in the nav. Every tap target is at least 44.

## Motion
Subtle and calm: fades of 0.2–0.35 s, no bounce or overshoot, no staggered entrances. Tapping scales to 0.97.

## Body map
Front and back figures with individual muscles. Each muscle group is shaded by its weekly target: grey (none), dark olive (started), olive (over half), lime (target hit). "You focused on" lists the groups trained this week with set counts.
