# Gacha Calc

A planning console for players who save premium currency across several gacha games. Enter what you have saved and see how many pulls it buys, how close you are to the spark or pity target, and whether the limited banner is covered.

Live: [https://franshjy.github.io/gacha-calc/](https://franshjy.github.io/gacha-calc/)

## Stack

- [Svelte 5](https://svelte.dev/) with runes
- [Vite 8](https://vite.dev/) (the Create React App build is gone)
- [Vitest](https://vitest.dev/) for the calculator and storage engine
- Plain CSS with per-game accent tokens and a system-aware light/dark theme
- Hash routing, so the static GitHub Pages build keeps working without a server

## Supported calculators

| Game | Saved resources | Target |
| --- | --- | --- |
| Granblue Fantasy | Crystals, draw tickets, 10-part tickets | Spark at 300 draws |
| Blue Archive | Pyroxenes, recruitment tickets, 10× tickets | Spark at 200 recruits |
| Honkai: Star Rail | Stellar Jade, Oneiric Shards, Special Passes, Star Rail Passes | Hard pity at 90, guarantee at 180 warps |
| Zenless Zone Zero | Polychromes, Monochrome Film, Encrypted and Master Tapes | Hard pity at 90, guarantee at 180 searches |
| Goddess of Victory: Nikke | Gems, advanced and standard recruit vouchers | Gold Mileage at 200 recruits |
| Wuthering Waves | Astrite, Lunite, Radiant, Lustrous and Forging Tides | Hard pity at 80, guarantee at 160 convenes |

## What it does

- Converts currency and tickets into pulls live as you type.
- Shows the result as a readiness state — empty, building, close, hard-pity covered, or ready — instead of a bare number.
- Draws one pity track per game with every threshold marked, plus a "you are here" marker.
- Keeps every game's currency layout and terminology distinct while sharing one interaction model.
- Persists totals in `localStorage` and migrates values saved by the old React build (`gbf_crystals`, `wuwa_lunites`, and friends) on first load.
- Saves the theme choice, follows `prefers-color-scheme` when no choice is saved, and honors `prefers-reduced-motion`.
- Works from 375px up: the game collage becomes a single column and the all-games sheet takes the full screen.

## Scripts

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # calculator + storage tests
npm run build      # static output in dist/
npm run preview    # http://localhost:4173/gacha-calc/
npm run deploy     # publish dist/ with gh-pages
```

The production build uses the `/gacha-calc/` base path for GitHub Pages. For any other host, change `base` in `vite.config.js`.

## Layout

```
src/
  App.svelte                 hash route + resolved theme
  app.css                    design tokens, reset, shared utilities
  components/
    AppHeader.svelte         sticky header, theme switch, all-games sheet
    Collage.svelte           the art collage used on home and in the sheet
    BannerScreen.svelte      art banner + large pull readout + prev/next pager
    PityTrack.svelte         one long track with threshold notches
    CurrencySlots.svelte     dense inputs with live per-slot conversion
    TicketGlyph.svelte       marked placeholder for missing ticket art
    PlaceholderGlyph.svelte  marked placeholder for missing currency art
  lib/
    games.js                 game config, pull math, verdict copy
    storage.js               versioned persistence + legacy migration
    state.svelte.js          reactive totals and theme store
    art.js                   art, logos, currency icons, crop positions
    route.js                 #gbf and #/gbf hash parsing
  routes/
    HomePage.svelte
    GamePage.svelte
```

## Notes on assets

Game art has been resized and converted to WebP for the web while keeping the original files in `src/assets/`. Where the repository has no asset, the UI says so through a deliberately simple placeholder rather than inventing art:

- Wuthering Waves has no background art. Its banner uses a typographic panel built from the real `logo-icon.svg`.
- Granblue Fantasy and Blue Archive have no ticket icons. Those inputs use a dashed ticket glyph marked ×1 / ×10.
- Lunite has no icon. Its input uses a dashed "L" glyph.

Light-on-dark wordmarks are used on collages and banners; Blue Archive's art carries its own logo. In the light theme the wordmark sits on a dark plate. Granblue's monochrome wordmark is inverted in CSS so it stays legible on that plate.
