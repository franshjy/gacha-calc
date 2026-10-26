<script>
  import { GAMES, calc, fmt, plural } from '../lib/games.js';
  import { valuesFor } from '../lib/state.svelte.js';

  /*
   * Navigation rail. It is always on above 1080px, where it takes its width out
   * of the page; below that it is a drawer that the pointer opens by touching
   * the left edge and the header button opens on click, so touch users are not
   * left without a way in.
   */
  let { route, open = $bindable(false) } = $props();

  let wide = $state(true);
  let byHover = $state(false);
  let railEl = $state();

  function peek() {
    if (wide) return;
    open = true;
    byHover = true;
  }

  function close() {
    open = false;
    byHover = false;
  }

  function leave() {
    if (byHover) close();
  }

  $effect(() => {
    const query = window.matchMedia('(min-width: 1080px)');
    const sync = () => {
      wide = query.matches;
      if (wide) close();
    };
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  });

  $effect(() => {
    route;
    close();
  });

  $effect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key !== 'Escape') return;
      close();
      document.getElementById('rail-toggle')?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  /* Opening from the button is a deliberate move, so focus lands on the current
     game; peeking with the pointer must never steal focus. */
  $effect(() => {
    if (wide || !open || byHover) return;
    if (!railEl || railEl.contains(document.activeElement)) return;
    (railEl.querySelector('[aria-current="page"]') ?? railEl.querySelector('a'))?.focus();
  });
</script>

{#if !wide}
  <div class="hot" aria-hidden="true" onpointerenter={peek}></div>
  {#if open}
    <div class="scrim" aria-hidden="true" onclick={close}></div>
  {/if}
{/if}

<nav
  id="rail"
  class="rail"
  class:open
  bind:this={railEl}
  aria-label="Games"
  onpointerenter={peek}
  onpointerleave={leave}
  onfocusin={() => {
    byHover = false;
    open = true;
  }}
  onfocusout={(event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) close();
  }}
>
  <a class="item all" href="#home" aria-current={route === 'home' ? 'page' : undefined}>
    <span class="row">
      <svg viewBox="0 0 14 14" aria-hidden="true">
        <path d="M0 0h6v6H0zM8 0h6v6H8zM0 8h6v6H0zM8 8h6v6H8z" fill="currentColor" />
      </svg>
      <span class="nm">All</span>
    </span>
  </a>

  <ul>
    {#each GAMES as game (game.id)}
      {@const result = calc(game, valuesFor(game.id))}
      <li>
        <a
          class="item"
          href={'#' + game.id}
          data-game={game.id}
          aria-current={route === game.id ? 'page' : undefined}
          aria-label={`${game.name}: ${fmt(result.pulls)} ${plural(game, result.pulls)}`}
        >
          <span class="row">
            <span class="code">{game.code}</span>
            <span class="nm">{game.name}</span>
          </span>
          <span class="bar" aria-hidden="true"><i style="width: {result.ratio * 100}%"></i></span>
        </a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  .rail {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 30;
    width: 252px;
    max-width: 82vw;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 10px 8px calc(10px + env(safe-area-inset-bottom, 0px));
    background: var(--panel);
    border-right: 1px solid var(--line);
    overflow-y: auto;
    overscroll-behavior: contain;
    transform: translateX(-100%);
    visibility: hidden;
    transition:
      transform 180ms ease-out,
      visibility 0s linear 180ms;
  }

  .rail.open {
    transform: none;
    visibility: visible;
    transition: transform 180ms ease-out;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .item {
    display: block;
    padding: 9px 10px 10px;
    text-decoration: none;
    color: var(--muted);
    border-bottom: 1px solid var(--line);
  }

  .item:hover {
    color: var(--ink);
    background: color-mix(in srgb, var(--acc, var(--ink)) 9%, transparent);
  }

  .item[aria-current='page'] {
    color: var(--ink);
    background: color-mix(in srgb, var(--acc, var(--ink)) 15%, transparent);
    box-shadow: inset 3px 0 0 var(--acc, var(--ink));
  }

  .row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  svg {
    width: 14px;
    height: 14px;
    flex: none;
  }

  .code {
    font: 700 15px/1 var(--font-d);
    letter-spacing: 0.1em;
  }

  .nm {
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bar {
    display: block;
    height: 4px;
    margin-top: 8px;
    background: var(--track);
  }

  .bar i {
    display: block;
    height: 100%;
    background: var(--acc, var(--ink));
  }

  .hot {
    position: fixed;
    z-index: 21;
    inset: 0 auto 0 0;
    width: 22px;
  }

  .scrim {
    position: fixed;
    z-index: 25;
    inset: 0;
    background: rgb(var(--scrim) / 0.6);
  }

  @media (min-width: 1080px) {
    .rail {
      width: var(--rail);
      max-width: none;
      padding: 12px 0 calc(14px + env(safe-area-inset-bottom, 0px));
      transform: none;
      visibility: visible;
      transition: none;
      overflow-x: hidden;
    }

    .item {
      padding: 12px 6px 11px;
      text-align: center;
    }

    .row {
      flex-direction: column;
      gap: 7px;
    }

    .nm {
      display: none;
    }

    .all .row {
      gap: 8px;
    }

    .all .nm {
      display: block;
      font: 600 11px/1 var(--font-d);
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .bar {
      margin-top: 8px;
    }
  }
</style>
