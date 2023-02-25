<script lang="ts">
  import { page } from '$app/stores';
  import '@picocss/pico';
  import Links from './Links.svelte';
  import { afterNavigate } from '$app/navigation';

  let detailsOpen = false;

  afterNavigate(() => (detailsOpen = false));
</script>

<header>
  <nav>
    <ul class="mobile">
      <li>
        <details role="list" bind:open={detailsOpen}>
          <summary aria-haspopup="listbox">Menu</summary>
          <ul role="listbox">
            <Links />
          </ul>
        </details>
      </li>
    </ul>
    <ul class="desktop">
      <Links />
    </ul>
    <ul>
      <li>
        {#if $page.data.session}
          <a href="/auth/signout" data-sveltekit-preload-data="off" role="button">Sign out</a>
        {:else}
          <a href="/auth/signin" data-sveltekit-preload-data="off" role="button">Sign in</a>
        {/if}
      </li>
    </ul>
  </nav>
</header>
<main>
  <slot />
</main>

<style>
  .desktop {
    display: none;
  }
  @media (min-width: 992px) {
    .mobile {
      display: none;
    }
    .desktop {
      display: flex;
    }
  }
</style>
