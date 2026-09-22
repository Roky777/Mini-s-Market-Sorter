# Mini's Market Sorter — Grade 1 English

A dependency-free browser sorting game made from the completed sorting template.

## Levels

| Level | Challenge | Belt items | Goal |
| --- | --- | ---: | ---: |
| 1 | Fruit or Vegetable? | 3 | 10 |
| 2 | Colour Basket Sort | 4 | 10 |
| 3 | Market Categories | 4 | 11 |

The game preserves the template HUD, Sparky reactions, tutorial, pause screen, success screen, spacing protection, responsive layout, lazy image decoding, and local/WebView save behavior. Only the level content, category boxes, campaign counts, and Grade 1 pacing are changed.

Serve the folder over HTTP (for example `npx serve .`) so the ES modules load correctly.

Useful previews:

- `?level=1`, `?level=2`, or `?level=3`
- `?success=1&stars=3`
- `successScreen.list()` in the browser console
