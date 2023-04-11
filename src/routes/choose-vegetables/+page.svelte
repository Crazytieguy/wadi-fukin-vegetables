<script lang="ts">
  import VegetableImg from '$lib/VegetableImg.svelte';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const { form, enhance, constraints, delayed, capture, restore } = superForm(data.form, {
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
    <section class="flex">
      {#each data.lastOrder.orderVegetables as { vegetable, vegetableId } (vegetableId)}
        <article class="vegetable">
          <p>
            <VegetableImg {...vegetable} />
          </p>
          <hgroup>
            <h3>
              {vegetable.name}
            </h3>
            <p>
              <strong>
                ₪ {vegetable.pricePerUnit}
              </strong>
              per {vegetable.unit}
            </p>
          </hgroup>
          <input
            type="number"
            name={vegetableId}
            bind:value={$form[vegetableId]}
            {...notypecheck($constraints)[vegetableId]}
          />
        </article>
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
  h3,
  p {
    margin-block: 0.5rem;
  }
  input[type='number'] {
    max-width: 6rem;
    margin-bottom: 0;
  }
</style>
