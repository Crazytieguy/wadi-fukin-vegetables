<script lang="ts">
  import '@picocss/pico';
  import Links from './Links.svelte';
  import './global.css';

  export let data;

  let [authHref, authText] = data.session
    ? ['/auth/signout', 'Sign out']
    : ['/auth/signin', 'Sign in'];

  let isAdmin = data.session?.user?.isAdmin;
</script>

<svelte:head>
  <title>Wadi Fukin Vegetables</title>
  <meta name="description" content="an application for vegetable group orders from Wadi Fukin." />
  <meta name="google-site-verification" content="wF6kbeBwIbxikrdrqhgVSx5ymzkyUNmJoJ7aZoFAuOc" />
</svelte:head>
<div class="app">
  <header>
    <nav>
      <ul>
        <Links {isAdmin} />
      </ul>
      <ul>
        <li>
          <a href={authHref} data-sveltekit-preload-data="off" role="button">{authText}</a>
        </li>
      </ul>
    </nav>
  </header>
  <main>
    <slot />
  </main>
</div>

<style>
  .app {
    max-width: 45rem;
    margin-inline: auto;
  }
</style>
