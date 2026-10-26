<script>
  import { tick } from 'svelte';
  import { fmt, plural, toDigits } from '../lib/games.js';
  import { CURRENCY } from '../lib/art.js';
  import { clearGame, setField } from '../lib/state.svelte.js';

  let { game, values } = $props();

  function onInput(event, field) {
    const clean = toDigits(event.currentTarget.value);
    if (event.currentTarget.value !== clean) event.currentTarget.value = clean;
    setField(game.id, field.k, clean);
  }

  async function clearAll() {
    clearGame(game.id);
    await tick();
    document.getElementById(`in-${game.id}-${game.fields[0].k}`)?.focus();
  }

  function caption(field) {
    const n = Number(values[field.k]) || 0;

    /* gold mileage buys the exchange one for one, so the count beside it
       already says everything a caption would */
    if (field.nocap) return '';
    if (field.side) return field.side;
    if (field.tix) return `= ${fmt(n * field.tix)} ${plural(game, n * field.tix)}`;

    const pulls = (n / game.cost.per).toFixed(1);
    return `≈ ${pulls} ${game.unit[1]}`;
  }
</script>

<section class="slots-sec wrap" aria-labelledby="saved-heading">
  <div class="inner">
    <div class="s-head">
      <h2 id="saved-heading">Saved currency</h2>
      <button class="clear" type="button" onclick={clearAll}>Clear all</button>
    </div>

    <div class="slots">
      {#each game.fields as field (field.k)}
        {@const cap = caption(field)}
        <div class="slot">
          <span class="ic">
            <img src={CURRENCY[field.icon]} alt="" width="64" height="64" />
          </span>

          <label for={`in-${game.id}-${field.k}`}>{field.label}</label>
          <input
            id={`in-${game.id}-${field.k}`}
            type="text"
            inputmode="numeric"
            autocomplete="off"
            spellcheck="false"
            maxlength="7"
            value={values[field.k] || ''}
            aria-describedby={cap ? `cv-${game.id}-${field.k}` : undefined}
            onfocus={(event) => event.currentTarget.select()}
            oninput={(event) => onInput(event, field)}
          />
          {#if cap}
            <span class="cv tn" id={`cv-${game.id}-${field.k}`}>{cap}</span>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .slots-sec {
    padding-block: 26px 48px;
  }

  .s-head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 6px 18px;
    margin-bottom: 14px;
  }

  .s-head h2 {
    font: 700 20px/1 var(--font-d);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .clear {
    margin-left: auto;
    border: 1px solid var(--ink);
    background: none;
    padding: 6px 14px;
    font: 600 14px/1 var(--font-b);
  }

  .clear:hover {
    background: var(--ink);
    color: var(--bg);
  }

  .slots {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 10px;
  }

  .slot {
    position: relative;
    background: var(--panel);
    padding: 16px 16px 14px;
    display: grid;
    grid-template-columns: 64px 1fr;
    gap: 4px 14px;
    align-items: center;
    /* a slot without a caption (Nikke gold mileage) still lines its label and
       input up with its neighbours, which centring the rows would not */
    align-content: start;
    clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%);
  }

  .slot::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 3px;
    background: transparent;
  }

  .slot:focus-within::after {
    background: var(--acc);
  }

  .ic {
    grid-row: 1 / 4;
    color: var(--muted);
  }

  .ic img {
    width: 64px;
    height: 64px;
    object-fit: contain;
  }

  .slot label {
    font-weight: 700;
    font-size: 15px;
    line-height: 1.2;
  }

  .slot input {
    width: 100%;
    min-width: 0;
    border: 0;
    border-bottom: 1px solid var(--line);
    background: transparent;
    color: var(--ink);
    font: 700 30px/1.15 var(--font-d);
    font-variant-numeric: tabular-nums;
    padding: 0;
  }

  .slot input:focus {
    outline: none;
    border-bottom-color: var(--acc);
  }

  .cv {
    font-size: 13px;
    color: var(--muted);
  }

  @media (max-width: 760px) {
    .s-head {
      align-items: center;
    }

    .s-head h2 {
      margin-right: auto;
    }

    .slots {
      grid-template-columns: 1fr 1fr;
      gap: 6px;
    }

    .slot {
      grid-template-columns: 1fr;
      padding: 12px;
      gap: 2px;
    }

    .ic {
      grid-row: auto;
    }

    .ic img {
      width: 44px;
      height: 44px;
    }

    .slot:last-child:nth-child(odd) {
      grid-column: 1 / -1;
    }

    .slot input {
      font-size: 26px;
    }
  }

  @media (max-width: 340px) {
    .slots {
      grid-template-columns: 1fr;
    }
  }
</style>
