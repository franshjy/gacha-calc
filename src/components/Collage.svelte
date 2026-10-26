<script>
  import { GAMES, calc, fmt, plural, STATE_WORD } from '../lib/games.js';
  import { GAME_ART, GAME_LOGO } from '../lib/art.js';
  import { valuesFor } from '../lib/state.svelte.js';

  let { current = 'home', dark = false, compact = false, onpick = () => {} } = $props();

  /** Column spans from the grid below, so `sizes` matches each tile's real width. */
  const SPAN = { gbf: 7, hsr: 5, ba: 5, zzz: 4, nikke: 4, wuwa: 4 };
</script>

<div class="collage" class:compact>
  {#each GAMES as game (game.id)}
    {@const art = GAME_ART[game.id][dark ? 'dark' : 'light']}
    {@const result = calc(game, valuesFor(game.id))}
    {@const last = game.marks[game.marks.length - 1]}
    {@const percent = Math.round(result.ratio * 100)}
    <a
      class="tile"
      href={'#' + game.id}
      data-game={game.id}
      style="--area: {game.id}"
      aria-current={current === game.id ? 'page' : undefined}
      aria-label={`${game.name}: ${fmt(result.pulls)} ${plural(game, result.pulls)}, ${STATE_WORD[result.state].toLowerCase()}, ${last.label} ${percent}%`}
      onclick={onpick}
    >
      {#if art.src}
        <img
          class="art"
          src={art.src}
          srcset={art.srcSet}
          sizes={`(max-width: 760px) 100vw, ${Math.round((SPAN[game.id] / 12) * 100)}vw`}
          alt=""
          style="--pos: {art.tilePos ?? art.pos}; --pos-m: {art.tilePosMobile ?? art.posMobile}"
        />
      {/if}

      <span class="cap">
        <span class="id">
          {#if art.baked}
            <span class="sr">{game.name}</span>
          {:else}
            <img class="logo" class:invert={game.id === 'gbf'} src={GAME_LOGO[game.id]} alt={game.name} />
          {/if}
        </span>

        <span class="rd">
          <span class="n tn">
            {fmt(result.pulls)}<small>{plural(game, result.pulls)}</small>
          </span>
          <span class="w">{last.label} {percent}%</span>
          <span class="mini" aria-hidden="true"><i style="width: {result.ratio * 100}%"></i></span>
        </span>
      </span>
    </a>
  {/each}
</div>

<style>
  .collage {
    display: grid;
    gap: 3px;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-template-rows: 230px 230px 270px;
    grid-template-areas:
      'gbf gbf gbf gbf gbf gbf gbf hsr hsr hsr hsr hsr'
      'gbf gbf gbf gbf gbf gbf gbf ba ba ba ba ba'
      'zzz zzz zzz zzz nikke nikke nikke nikke wuwa wuwa wuwa wuwa';
  }

  .tile {
    grid-area: var(--area);
    position: relative;
    display: block;
    overflow: hidden;
    text-decoration: none;
    color: var(--on-art);
    background: var(--panel);
    min-height: 0;
  }

  .tile::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgb(var(--scrim) / 0);
    transition: background 180ms ease-out;
    pointer-events: none;
  }

  .tile:hover::after,
  .tile:focus-visible::after {
    background: rgb(var(--scrim) / 0.18);
  }

  .tile:focus-visible {
    outline-offset: -4px;
    outline-color: #ffffff;
  }

  .art {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    max-width: none;
    object-fit: cover;
    object-position: var(--pos);
  }

  .cap {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    padding: 48px 16px 14px;
    background: linear-gradient(
      to top,
      rgb(var(--scrim) / 0.92),
      rgb(var(--scrim) / 0.78) 55%,
      rgb(var(--scrim) / 0)
    );
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 12px;
  }

  .tile:hover .cap,
  .tile:focus-visible .cap {
    background: linear-gradient(
      to top,
      rgb(var(--scrim) / 0.96),
      rgb(var(--scrim) / 0.86) 60%,
      rgb(var(--scrim) / 0)
    );
  }

  .id {
    min-width: 0;
  }

  .logo {
    height: 40px;
    width: auto;
    max-width: 52%;
    object-fit: contain;
    object-position: left bottom;
  }

  .logo.invert {
    filter: invert(1);
  }

  .rd {
    display: grid;
    justify-items: end;
    gap: 4px;
    text-align: right;
    flex: none;
  }

  .n {
    font: 700 34px/0.9 var(--font-d);
    font-variant-numeric: tabular-nums;
  }

  .n small {
    font-size: 14px;
    margin-left: 5px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .w {
    font-size: 13px;
    font-weight: 600;
  }

  .mini {
    width: 130px;
    height: 5px;
    background: rgb(255 255 255 / 0.28);
    position: relative;
  }

  .mini i {
    position: absolute;
    inset: 0 auto 0 0;
    background: #ffffff;
  }

  .compact {
    grid-template-rows: 150px 150px 170px;
  }

  .compact .logo {
    height: 30px;
  }

  .compact .n {
    font-size: 24px;
  }

  .compact .mini {
    width: 90px;
  }

  @media (max-width: 760px) {
    .collage,
    .compact {
      grid-template-columns: 1fr;
      grid-template-rows: none;
      grid-auto-rows: 150px;
      grid-template-areas: none;
    }

    .compact {
      grid-auto-rows: 104px;
    }

    .tile {
      grid-area: auto;
    }

    .art {
      object-position: var(--pos-m);
    }

    .cap {
      padding: 40px 16px 12px;
    }

    .logo {
      height: 30px;
    }

    .n {
      font-size: 26px;
    }

    .mini {
      width: 90px;
    }

    .compact .cap {
      padding: 28px 12px 10px;
    }

    .compact .logo {
      height: 22px;
    }

    .compact .n {
      font-size: 20px;
    }

    .compact .mini {
      width: 70px;
    }

    .compact .w {
      font-size: 12px;
    }

    .tile[aria-current='page']::before {
      padding: 6px 8px;
      font-size: 11px;
    }
  }
</style>
