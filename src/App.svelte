<script>
  import AppHeader from './components/AppHeader.svelte';
  import NavRail from './components/NavRail.svelte';
  import HomePage from './routes/HomePage.svelte';
  import GamePage from './routes/GamePage.svelte';
  import { GAME_BY_ID } from './lib/games.js';
  import { parseRoute, HOME_ROUTE } from './lib/route.js';
  import { app, setTheme } from './lib/state.svelte.js';

  let route = $state(parseRoute(window.location.hash));
  let systemDark = $state(window.matchMedia('(prefers-color-scheme: dark)').matches);
  let railOpen = $state(false);

  const dark = $derived(app.theme ? app.theme === 'dark' : systemDark);
  const game = $derived(route === HOME_ROUTE ? null : GAME_BY_ID[route]);

  function skipToContent(event) {
    event.preventDefault();
    document.getElementById('view')?.focus();
  }

  $effect(() => {
    const onHashChange = () => {
      route = parseRoute(window.location.hash);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  });

  $effect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      systemDark = query.matches;
    };

    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  });

  $effect(() => {
    const root = document.documentElement;
    if (app.theme) root.dataset.theme = app.theme;
    else delete root.dataset.theme;

    // the manifest's theme_color only covers the install splash, and there is
    // one of it, so the loaded page keeps its own meta in step with the theme
    // actually being rendered
    const chrome = document.querySelector('meta[name="theme-color"]');
    if (chrome) chrome.content = dark ? '#0f1114' : '#e8ebee';
  });

  $effect(() => {
    document.title = game ? `${game.name} · Gacha Calc` : 'Gacha Calc';
  });
</script>

<a class="skip-link" href="#view" onclick={skipToContent}>Skip to content</a>

<NavRail {route} bind:open={railOpen} />

<AppHeader
  {route}
  {dark}
  onTheme={setTheme}
  railOpen={railOpen}
  onRail={() => (railOpen = !railOpen)}
/>

<main id="view" tabindex="-1">
  {#if game}
    <GamePage {game} {dark} />
  {:else}
    <HomePage {dark} />
  {/if}
</main>
