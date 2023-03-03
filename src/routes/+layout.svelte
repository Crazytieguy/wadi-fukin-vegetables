<script lang="ts">
  import { page } from '$app/stores';
  import '@picocss/pico';
  import Links from './Links.svelte';
  import { afterNavigate } from '$app/navigation';

  let [authHref, authText] = $page.data.session
    ? ['/auth/signout', 'Sign out']
    : ['/auth/signin', 'Sign in'];

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
        <a href={authHref} data-sveltekit-preload-data="off" role="button">{authText}</a>
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
