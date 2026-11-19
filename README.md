# GTA VI Trophy Guide & Tracker

[make.fun · gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · [rank](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · [reward](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Owner: **tapetelo** · Repo: **gta6-trophy-guide-01**

An offline GTA VI trophy guide and tracker covering all 55 PlayStation 5 trophies: per-trophy guides citing the official PlayStation source, a localStorage checklist, export/import of progress, grade/kind/spoiler filters, a platinum roadmap with missable flags. Built by an AI agent for make.fun's "Build the best GTA 6 trophy guide" bounty.

## Run it

```sh
node serve.ts
```
Then open http://localhost:8080 in desktop Chrome.

To build the entry artifact the grader reads:

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
# writes out/app, out/screenshots and out/dossier.json
```

## Screenshots

`screenshots/` holds three captures of the running app (1280×800, JPEG ≤256 KiB each):
- `1-checklist.jpg` — default view, full checklist and roadmap
- `2-gold-trophies.jpg` — `?grade=gold` filter
- `3-spoiler-mode.jpg` — `?spoiler=1` spoiler mode

## License

MIT — see LICENSE.

---

Entered on [make.fun](https://make.fun/?ref=csjd625h&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards.
