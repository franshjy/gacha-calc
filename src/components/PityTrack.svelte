<script>
  import { fmt, plural } from '../lib/games.js';

  let { game, result } = $props();

  const max = $derived(game.marks[game.marks.length - 1].at);
  const step = $derived((10 / max) * 100);

  function pct(n) {
    return Math.min(100, (n / max) * 100);
  }

  const youLeft = $derived(Math.max(3, Math.min(97, pct(result.pulls))));
  const trackLabel = $derived(
    result.next
      ? `${fmt(result.pulls)} ${plural(game, result.pulls)} saved. ${fmt(result.short)} to ${result.next.label} at ${result.next.at}.`
      : `${fmt(result.pulls)} ${plural(game, result.pulls)} saved. ${game.marks[game.marks.length - 1].label} at ${max} is covered.`
  );
</script>

<section class="track-sec wrap" aria-label="Pity track">
  <div class="inner">
    <div class="track" role="img" aria-label={trackLabel} style="--step: {step}%">
      <div class="bar"><i style="width: {pct(result.pulls)}%"></i></div>
      <div class="ticks"></div>

      {#each game.marks as mark, i (mark.at)}
        <div class="notch" class:last={i === game.marks.length - 1} style="left: {pct(mark.at)}%">
          <span>
            {mark.label}
            <small>{mark.at} {plural(game, mark.at)}</small>
          </span>
        </div>
      {/each}

      <div class="you tn" style="left: {youLeft}%">
        {result.pulls > max ? `${fmt(max)} + ${fmt(result.pulls - max)}` : `You · ${fmt(result.pulls)}`}
      </div>
    </div>

    <div class="t-foot">
      <span><b class="tn">{fmt(result.fromPool)}</b> from {game.cost.label}</span>
      <span><b class="tn">{fmt(result.tickets)}</b> from tickets</span>
      {#if game.marks.length > 1}
        <span>
          <b class="tn">{result.hard}</b> hard {result.hard === 1 ? 'pity' : 'pities'} ·
          <b class="tn">{result.guaranteed}</b> guaranteed limited
        </span>
      {/if}
      {#each result.side.filter((item) => item.n > 0) as item (item.label)}
        <span><b class="tn">{fmt(item.n)}</b> {item.label}</span>
      {/each}
      <span>Each tick is 10 {game.unit[1]}</span>
    </div>
  </div>
</section>

<style>
  .track-sec {
    background: var(--panel);
    padding-block: 26px 22px;
    border-bottom: 1px solid var(--line);
  }

  .track {
    position: relative;
    height: 92px;
    margin-right: 8px;
  }

  .bar {
    position: absolute;
    left: 0;
    right: 0;
    top: 46px;
    height: 16px;
    background: var(--track);
  }

  .bar i {
    position: absolute;
    inset: 0 auto 0 0;
    background: var(--acc);
    transition: width 250ms ease-out;
  }

  .ticks {
    position: absolute;
    left: 0;
    right: 0;
    top: 46px;
    height: 16px;
    background: repeating-linear-gradient(
      to right,
      transparent 0 calc(var(--step) - 2px),
      var(--panel) calc(var(--step) - 2px) var(--step)
    );
    pointer-events: none;
  }

  .notch {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 0;
  }

  .notch::before {
    content: '';
    position: absolute;
    top: 34px;
    bottom: 22px;
    left: -1.5px;
    width: 3px;
    background: var(--ink);
  }

  .notch span {
    position: absolute;
    top: 0;
    white-space: nowrap;
    font: 700 15px/1.1 var(--font-d);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    transform: translateX(-50%);
    text-align: center;
  }

  .notch span small {
    display: block;
    font: 500 12px/1.2 var(--font-b);
    color: var(--muted);
    letter-spacing: 0;
    text-transform: none;
  }

  .notch.last span {
    transform: translateX(-100%);
    text-align: right;
  }

  .you {
    position: absolute;
    top: 66px;
    transform: translateX(-50%);
    font: 700 13px/1 var(--font-d);
    color: var(--acc);
    white-space: nowrap;
    transition: left 250ms ease-out;
  }

  .you::before {
    content: '';
    display: block;
    margin: 0 auto 3px;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-bottom-color: var(--acc);
    border-top: 0;
  }

  .t-foot {
    display: flex;
    flex-wrap: wrap;
    align-content: start;
    gap: 6px 22px;
    font-size: 14px;
    line-height: 1.45;
    color: var(--muted);
  }

  .t-foot b {
    color: var(--ink);
    font-weight: 700;
  }

  @media (max-width: 900px) {
    .notch span {
      font-size: 12px;
    }

    .notch span small {
      font-size: 11px;
    }

    /* single-mark games fit one row, pity games need two: reserve two so the
       footer height never depends on which game is open */
    .t-foot {
      min-height: calc(2 * 1.45em + 6px);
    }
  }

  @media (max-width: 420px) {
    /* narrow phones push the pity stats onto a third row */
    .t-foot {
      min-height: calc(3 * 1.45em + 12px);
    }
  }
</style>
