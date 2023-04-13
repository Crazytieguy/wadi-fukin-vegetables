<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/stores';

  export let data;

  let detailsOpen = false;
  afterNavigate(() => (detailsOpen = false));
</script>

<h1>Order History</h1>

<nav>
  <details role="list" bind:open={detailsOpen}>
    <summary aria-haspopup="listbox">Select Order</summary>
    <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
    <ul role="listbox">
      {#each data.orders as { id, isActive, updatedAt } (id)}
        <li>
          {#if id == $page.params.id}
            {updatedAt.toLocaleDateString('en-GB')}
          {:else}
            <a href={`/order-history/${id}`}>
              {updatedAt.toLocaleDateString('en-GB')}
            </a>
          {/if}
        </li>
      {/each}
    </ul>
  </details>
  <ul />
</nav>
<slot />
