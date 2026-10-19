<script>
  import Collage from '../components/Collage.svelte';

  let { dark } = $props();
</script>

<div class="home wrap inner">
  <div class="home-head">
    <h1>Banner readiness</h1>
    <p>Saved totals for each game. Open one to update it.</p>
  </div>

  <Collage current="home" {dark} />
</div>

<style>
  .home {
    padding-bottom: 48px;
  }

  .home-head {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: end;
    gap: 8px 20px;
    padding-block: 18px 16px;
  }

  .home-head h1 {
    font: 700 clamp(30px, 4vw, 48px) / 1 var(--font-d);
    text-transform: uppercase;
  }

  .home-head p {
    color: var(--muted);
    max-width: 46ch;
  }
</style>
