<script>
  import Collage from './Collage.svelte';

  let { route, dark, onTheme } = $props();

  let dialog = $state();

  function openSheet() {
    if (dialog && !dialog.open) dialog.showModal();
  }

  function closeSheet() {
    if (dialog?.open) dialog.close();
  }

  function onDialogClick(event) {
    if (event.target === dialog) dialog.close();
  }
</script>

<header class="top">
  <div class="top-in wrap inner">
    <a class="brand" href="#home" aria-label="Gacha Calc home">Gacha<i>Calc</i></a>

    <button class="all" type="button" aria-haspopup="dialog" aria-controls="all-games" onclick={openSheet}>
      <svg viewBox="0 0 14 14" aria-hidden="true">
        <path d="M0 0h6v6H0zM8 0h6v6H8zM0 8h6v6H0zM8 8h6v6H8z" fill="currentColor" />
      </svg>
      All games
    </button>

    <div class="seg" role="group" aria-label="Theme">
      <button type="button" aria-pressed={!dark} onclick={() => onTheme('light')}>Light</button>
      <button type="button" aria-pressed={dark} onclick={() => onTheme('dark')}>Dark</button>
    </div>
  </div>
</header>

<dialog
  id="all-games"
  class="sheet"
  bind:this={dialog}
  aria-labelledby="sheet-h"
  onclick={onDialogClick}
>
  <div class="wrap sheet-inner">
    <div class="sheet-head">
      <h2 id="sheet-h">All games</h2>
      <button class="close" type="button" onclick={closeSheet}>Close</button>
    </div>
    <Collage current={route} {dark} compact onpick={closeSheet} />
  </div>
</dialog>

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

  .all {
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

  .all svg {
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

  .sheet {
    width: min(1100px, 100vw);
    max-width: 100vw;
    max-height: 100dvh;
    margin: auto;
    padding: 0;
    border: 0;
    overflow: auto;
    overscroll-behavior: contain;
    background: var(--bg);
    color: var(--ink);
  }

  .sheet::backdrop {
    background: rgb(var(--scrim) / 0.72);
  }

  .sheet-inner {
    padding-bottom: 16px;
  }

  .sheet-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-block: 14px;
    position: sticky;
    top: 0;
    z-index: 2;
    background: var(--bg);
  }

  .sheet-head h2 {
    font: 700 18px/1 var(--font-d);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .close {
    border: 1px solid var(--line);
    background: var(--panel);
    padding: 8px 12px;
    font-weight: 600;
  }

  @media (max-width: 900px) {
    .sheet {
      width: 100vw;
      height: 100dvh;
      max-height: 100dvh;
      margin: 0;
    }

    .sheet-inner {
      padding-top: env(safe-area-inset-top, 0px);
    }
  }

  @media (max-width: 760px) {
    .brand {
      font-size: 17px;
    }

    .all {
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
      flex-wrap: wrap;
      gap: 8px;
    }

    .seg {
      margin-left: auto;
    }
  }
</style>
