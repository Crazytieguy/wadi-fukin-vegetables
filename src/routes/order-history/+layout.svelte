<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/stores';

  export let data;

  let detailsOpen = false;
  $: order = $page.params.id ? data.orders.find(({ id }) => id == $page.params.id) : data.orders[0];
  afterNavigate(() => (detailsOpen = false));
</script>

<h1>
  Order History - {order?.updatedAt.toLocaleDateString('en-GB')}
</h1>

<nav>
  <details role="list" bind:open={detailsOpen}>
    <summary aria-haspopup="listbox">Select Order</summary>
    <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
    <ul role="listbox">
      {#each data.orders as { id, updatedAt } (id)}
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
