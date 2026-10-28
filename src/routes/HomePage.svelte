<script>
  import Collage from '../components/Collage.svelte';

  let { dark } = $props();
</script>

<div class="home wrap inner">
  <div class="home-head">
    <h1 class="sr">Gacha Calc</h1>
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
</style>
