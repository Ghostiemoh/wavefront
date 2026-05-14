# Article image assets

The article at [`../ARTICLE.md`](../ARTICLE.md) references six images. Five are product screenshots you need to capture from the live site; one (the architecture diagram) is already linked but should be saved here as a PNG for offline rendering on Medium / GitHub.

## Capture checklist

Target viewport: **1440 × 900**, dark mode, browser zoom 100%, no devtools open. Save as `.png` in this directory with the exact filenames below.

| # | Filename | URL | What to frame |
|---|---|---|---|
| 1 | `01-hero.png` | https://wavefront-gray.vercel.app/ | The hero section — orbs, headline, live narrative ticker visible |
| 2 | `02-feed.png` | https://wavefront-gray.vercel.app/feed | Top of the feed — at least 3 narrative cards + the trending strip |
| 3 | `03-verdict-a.png` | https://wavefront-gray.vercel.app/verdict/So11111111111111111111111111111111111111112 | SOL verdict — gauge, score bars, market stats |
| 4 | `04-verdict-f.png` | `https://wavefront-gray.vercel.app/verdict/<low-grade-mint>` — pick any F-graded scam mint you find in the feed | Same surface, red gauge, security flags listed |
| 5 | `05-copilot.png` | Any verdict page, scroll to the Copilot panel and ask a question | Copilot panel with one Q&A visible |
| 6 | `06-architecture.png` | [Open the diagram on Excalidraw](https://excalidraw.com/#json=4qSmdrEEZQ3wZSnqUKWcp,hiFATBhvgDDkxI0LdjN6Yg) → File → Export image → PNG | Save here as `06-architecture.png` |

## Quick capture commands (PowerShell + Edge / Chrome)

Edge / Chrome both have built-in full-page screenshot in devtools:

1. Open the URL.
2. `Ctrl+Shift+P` → type `screenshot` → choose **Capture full size screenshot** (or **Capture node screenshot** for a specific section).
3. Rename the file and drop it in this directory.

## Verification

After capture, run from the repo root:

```bash
ls wavefront/docs/images/*.png
```

You should see six files. Then open `wavefront/docs/ARTICLE.md` in VSCode preview and confirm every image loads.
