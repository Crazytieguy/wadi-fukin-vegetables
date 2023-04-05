<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const { errors, form, enhance, constraints } = superForm(data.form);

  const notypecheck = (x: any) => x;
</script>

<h1>Choose Vegetables</h1>

{#if data.lastOrder?.isActive}
  <form method="POST" use:enhance>
    <input type="hidden" name="orderId" bind:value={$form.orderId} {...$constraints.orderId} />
    <table>
      <tbody>
        {#each data.lastOrder.orderVegetables as { vegetable, vegetableId } (vegetableId)}
          <tr>
            <td>
              <img src={vegetable.imageUrl} alt={vegetable.name} />
              <p class="mobile">
                {vegetable.name}
              </p>
            </td>
            <td class="desktop">
              <p>
                {vegetable.name}
              </p>
            </td>
            <td class="desktop">
              <p>
                <strong>
                  ₪{vegetable.pricePerUnit}
                </strong>
                per {vegetable.unit}
              </p>
            </td>
            <td class="small">
              <input
                type="number"
                name={vegetableId}
                bind:value={$form[vegetableId]}
                {...notypecheck($constraints)[vegetableId]}
              />
              <p class="mobile price">
                <strong>
                  ₪{vegetable.pricePerUnit}
                </strong>
                per {vegetable.unit}
              </p>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    <button class="secondary">Update Order</button>
  </form>
{:else}
  <p>There is no active order.</p>
{/if}

<style>
  .price {
    text-align: center;
  }
</style>
