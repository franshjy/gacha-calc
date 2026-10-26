<script>
  let { dark, onTheme, railOpen, onRail } = $props();
</script>

<header class="top">
  <div class="top-in wrap inner">
    <a class="brand" href="#home" aria-label="Gacha Calc home">Gacha<i>Calc</i></a>

    <button
      id="rail-toggle"
      class="menu"
      type="button"
      aria-expanded={railOpen}
      aria-controls="rail"
      onclick={onRail}
    >
      <svg viewBox="0 0 14 14" aria-hidden="true">
        <path d="M0 0h6v6H0zM8 0h6v6H8zM0 8h6v6H0zM8 8h6v6H8z" fill="currentColor" />
      </svg>
      Games
    </button>

    <div class="seg" role="group" aria-label="Theme">
      <button type="button" aria-pressed={!dark} onclick={() => onTheme('light')}>Light</button>
      <button type="button" aria-pressed={dark} onclick={() => onTheme('dark')}>Dark</button>
    </div>
  </div>
</header>

<style>
  .top {
    position: sticky;
    top: env(safe-area-inset-top, 0px);
    z-index: 20;
    background: var(--bg);
  }

  .top-in {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-block: 10px;
  }

  .brand {
    font: 700 20px/1 var(--font-d);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    text-decoration: none;
    margin-right: auto;
  }

  .brand i {
    font-style: normal;
    color: var(--muted);
  }

  .menu {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 0;
    background: var(--ink);
    color: var(--bg);
    padding: 9px 14px;
    font: 600 14px/1 var(--font-d);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    white-space: nowrap;
    clip-path: polygon(0 0, 100% 0, 100% 70%, calc(100% - 8px) 100%, 0 100%);
  }

  .menu svg {
    width: 14px;
    height: 14px;
  }

  .seg {
    display: flex;
    border: 1px solid var(--line);
  }

  .seg button {
    border: 0;
    background: none;
    padding: 8px 11px;
    font: 600 13px/1 var(--font-b);
    color: var(--muted);
  }

  .seg button[aria-pressed='true'] {
    background: var(--panel);
    color: var(--ink);
    box-shadow: inset 0 -2px 0 var(--ink);
  }

  @media (min-width: 1080px) {
    .menu {
      display: none;
    }
  }

  @media (max-width: 760px) {
    .brand {
      font-size: 17px;
    }

    .menu {
      padding: 8px 10px;
      font-size: 13px;
    }

    .seg button {
      padding: 7px 8px;
      font-size: 12px;
    }
  }

  @media (max-width: 360px) {
    .top-in {
      gap: 8px;
    }
  }
</style>
