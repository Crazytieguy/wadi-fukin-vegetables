<script lang="ts">
  import { page } from '$app/stores';

  export let data;
</script>

<h1>Order History</h1>

<div class="flex">
  <aside>
    <nav>
      <ul>
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
    </nav>
  </aside>
  <div>
    <slot />
  </div>
</div>

<style>
  .flex {
    display: flex;
    gap: 1.5rem;
  }
  .flex div {
    flex: 1;
  }
</style>
