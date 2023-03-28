<script lang="ts">
  import type { PageData } from './$types';
  import '@picocss/pico';
  import './global.css';
  import Links from './Links.svelte';
  import { afterNavigate } from '$app/navigation';

  export let data: PageData;

  let [authHref, authText] = data.session
    ? ['/auth/signout', 'Sign out']
    : ['/auth/signin', 'Sign in'];

  let isAdmin = data.session?.user?.isAdmin;

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
            <Links {isAdmin} />
          </ul>
        </details>
      </li>
    </ul>
    <ul class="desktop">
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
