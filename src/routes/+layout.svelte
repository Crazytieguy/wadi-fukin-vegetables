<script lang="ts">
  import MediaQuery from 'svelte-media-queries';
  import { page } from '$app/stores';
  import '@picocss/pico';
  import Links from './Links.svelte';
</script>

<header>
  <nav>
    <ul>
      <MediaQuery query="(max-width: 992px)" let:matches>
        {#if matches}
          <li>
            <details role="list">
              <summary aria-haspopup="listbox">Menu</summary>
              <ul role="listbox">
                <Links />
              </ul>
            </details>
          </li>
        {:else}
          <Links />
        {/if}
      </MediaQuery>
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
