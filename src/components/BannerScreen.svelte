<script>
  import { fmt, plural } from '../lib/games.js';
  import { GAME_ART, GAME_LOGO } from '../lib/art.js';

  let { game, dark, result, copy } = $props();

  const art = $derived(GAME_ART[game.id][dark ? 'dark' : 'light']);
</script>

<section class="banner" aria-label="Banner readiness">
  <div class="b-art" aria-hidden="true">
    {#if art.src}
      <img
        src={art.src}
        srcset={art.srcSet}
        sizes="(min-width: 901px) 52vw, 100vw"
        alt=""
        style="--pos: {art.pos}; --pos-m: {art.posMobile}"
      />
    {/if}
  </div>

  <div class="b-panel">
    <h1 class="b-title" class:plate={!dark && !art.baked}>
      {#if art.baked}
        <span class="sr">{game.name}</span>
      {:else}
        <img class="b-logo" class:invert={game.id === 'gbf'} src={GAME_LOGO[game.id]} alt={game.name} />
      {/if}
    </h1>

    <div class="readout" aria-live="polite" aria-atomic="true">
      <p class="b-count">
        <span class="n tn">{fmt(result.pulls)}</span>
        <span class="u">{plural(game, result.pulls)}</span>
      </p>
      <p class="b-state">
        {#if copy.title}
          <span class="flag" data-s={result.state} aria-hidden="true"></span>
          {copy.title}
        {/if}
      </p>
      <p class="b-sub">{copy.sub}</p>
    </div>
  </div>
</section>

<style>
  .banner {
    position: relative;
    min-height: 440px;
    background: var(--tint);
    overflow: hidden;
  }

  .b-art {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 52%;
    background: var(--panel);
    clip-path: polygon(8% 0, 100% 0, 100% 100%, 0 100%);
  }

  .b-art img {
    width: 100%;
    height: 100%;
    max-width: none;
    object-fit: cover;
    object-position: var(--pos);
  }

  .b-panel {
    position: relative;
    z-index: 1;
    width: min(46%, calc(700px + var(--gutter)));
    padding: 30px 24px 34px var(--gutter);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 14px;
    min-height: 440px;
  }

  .b-title {
    display: flex;
    align-items: center;
    align-self: flex-start;
    /* fixed row: keeps every game (and both themes) at the same height */
    height: 78px;
  }

  .b-title.plate {
    background: #111418;
    padding: 0 14px;
  }

  .b-logo {
    height: 58px;
    width: auto;
    max-width: 300px;
    object-fit: contain;
    object-position: left;
  }

  .b-logo.invert {
    filter: invert(1);
  }

  .readout {
    display: grid;
    gap: 12px;
  }

  .b-count {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0 14px;
  }

  .b-count .n {
    font: 700 clamp(92px, 11vw, 150px) / 0.85 var(--font-d);
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }

  .b-count .u {
    font: 600 24px/1 var(--font-d);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--acc);
  }

  .b-state {
    display: flex;
    align-items: center;
    gap: 10px;
    font: 700 24px/1.1 var(--font-d);
    text-transform: uppercase;
    /* the empty state carries no words: hold the line so the panel cannot move */
    min-height: 1lh;
  }

  .flag {
    width: 26px;
    height: 16px;
    flex: none;
    clip-path: polygon(0 0, 100% 0, 78% 50%, 100% 100%, 0 100%);
    background: var(--acc);
  }

  .flag[data-s='building'],
  .flag[data-s='close'] {
    background: linear-gradient(to right, var(--acc) 50%, var(--track) 50%);
  }

  .flag[data-s='empty'] {
    background: var(--track);
  }

  .b-sub {
    max-width: 44ch;
    white-space: pre-line;
    /* two lines is the resting length for every game; reserving it stops the
       centred panel from shifting when a shorter message fits on one line */
    min-height: 2lh;
  }

  @media (max-width: 900px) {
    .banner {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .b-art {
      position: relative;
      width: 100%;
      height: 240px;
      flex: none;
      clip-path: polygon(0 0, 100% 0, 100% 84%, 0 100%);
    }

    .b-art img {
      object-position: var(--pos-m);
    }

    .b-panel {
      width: 100%;
      min-height: 0;
      padding: 8px 16px 12px;
    }

    .b-title {
      height: 62px;
    }

    .b-logo {
      height: 42px;
    }

    .b-count .n {
      font-size: 104px;
    }

    .b-state {
      font-size: 21px;
    }
  }

  @media (max-width: 420px) {
    .b-art {
      height: 208px;
    }

    .b-count .n {
      font-size: 92px;
    }
  }
</style>
