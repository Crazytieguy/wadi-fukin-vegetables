<script lang="ts">
  import VegetableImg from '$lib/VegetableImg.svelte';
import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const { errors, form, enhance, constraints, delayed } = superForm(data.form);

  $: userHasOrdered = !!data.lastOrder?.userOrderVegetables.length;
  $: total = data.lastOrder?.orderVegetables.reduce(
    (total, { vegetable }) => total + vegetable.pricePerUnit * $form[vegetable.id],
    0
  );

  const notypecheck = (x: any) => x;
</script>

<h1>
  {#if userHasOrdered}
    Update Your Order
  {:else}
    Choose Vegetables
  {/if}
</h1>

{#if data.lastOrder?.isActive}
  <form method="POST" use:enhance>
    <input type="hidden" name="orderId" bind:value={$form.orderId} {...$constraints.orderId} />
    <table>
      <tbody>
        {#each data.lastOrder.orderVegetables as { vegetable, vegetableId } (vegetableId)}
          <tr>
            <td>
              <VegetableImg {...vegetable} />
            </td>
            <td class="desktop">
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
            </td>
            <td>
              <hgroup class="mobile">
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
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    <h3 class="total">
      Total ₪ {total}
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
</style>
