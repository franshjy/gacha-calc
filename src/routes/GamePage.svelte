<script>
  import BannerScreen from '../components/BannerScreen.svelte';
  import PityTrack from '../components/PityTrack.svelte';
  import CurrencySlots from '../components/CurrencySlots.svelte';
  import { calc, verdict } from '../lib/games.js';
  import { valuesFor } from '../lib/state.svelte.js';

  let { game, dark } = $props();

  const values = $derived(valuesFor(game.id));
  const result = $derived(calc(game, values));
  const copy = $derived(verdict(game, result));
</script>

<article data-game={game.id}>
  <BannerScreen {game} {dark} {result} {copy} />
  <PityTrack {game} {result} />
  <CurrencySlots {game} {values} />
</article>
