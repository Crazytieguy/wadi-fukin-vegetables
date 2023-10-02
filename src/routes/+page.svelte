<script lang="ts">
  import Vegetable from '$lib/Vegetable.svelte';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  // non null assertion - only relevant if there has never been an order
  const { form, enhance, constraints, delayed, capture, restore } = superForm(data.form!, {
    taintedMessage: null
  });

  export const snapshot = { capture, restore };

  $: userHasOrdered = !!data.lastOrder?.userOrderVegetables.length;
  $: total = data.lastOrder?.orderVegetables.reduce(
    (total, { vegetable }) => total + vegetable.pricePerUnit * $form[vegetable.id],
    0
  );

  const notypecheck = (x: any) => x;
</script>

<h1>
  {#if userHasOrdered && data.lastOrder?.isActive}
    Update Your Order
  {:else}
    Choose Vegetables
  {/if}
</h1>

{#if data.lastOrder?.isActive}
  <form method="POST" use:enhance>
    <input type="hidden" name="orderId" bind:value={$form.orderId} {...$constraints.orderId} />
    <section class="vegetable-grid">
      {#each data.lastOrder.orderVegetables as { vegetable, vegetableId } (vegetableId)}
        <Vegetable {vegetable}>
          <input
            type="number"
            name={vegetableId}
            bind:value={$form[vegetableId]}
            {...notypecheck($constraints)[vegetableId]}
          />
        </Vegetable>
      {/each}
    </section>
    <h3 class="total">
      Total ₪ {total?.toFixed(2)}
    </h3>
    <button class="secondary" aria-busy={$delayed}>
      {#if userHasOrdered}
        Update Order
      {:else}
        Submit Order
      {/if}
    </button>
  </form>
{:else}
  <p>There is no active order.</p>
{/if}

<style>
  .total {
    text-align: center;
  }
  input[type='number'] {
    margin-bottom: 0;
  }
</style>
