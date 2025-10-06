<script lang="ts">
  export let data;

  $: orderedItems = data.order?.userOrderVegetables || [];
  $: total = orderedItems.reduce(
    (sum, { vegetable, quantity }) => sum + vegetable.pricePerUnit * quantity,
    0
  );
</script>

<h1>Order Submitted Successfully!</h1>

{#if orderedItems.length > 0}
  <article>
    <h2>Your Order Summary</h2>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Quantity</th>
          <th>Price per {orderedItems[0].vegetable.unit}</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {#each orderedItems as { vegetable, quantity }}
          <tr>
            <td>{vegetable.name}</td>
            <td>{quantity} {vegetable.unit}</td>
            <td>₪{vegetable.pricePerUnit.toFixed(2)}</td>
            <td>₪{(vegetable.pricePerUnit * quantity).toFixed(2)}</td>
          </tr>
        {/each}
      </tbody>
      <tfoot>
        <tr>
          <th colspan="3">Total</th>
          <th>₪{total.toFixed(2)}</th>
        </tr>
      </tfoot>
    </table>
  </article>

  <p>
    <a href="/" role="button" class="secondary">Update My Order</a>
  </p>
{:else}
  <p>You haven't ordered any items yet.</p>
  <p>
    <a href="/" role="button">Go to Order Page</a>
  </p>
{/if}

<style>
  table {
    width: 100%;
  }
  tfoot th {
    text-align: right;
  }
  tbody td:nth-child(2),
  tbody td:nth-child(3),
  tbody td:nth-child(4),
  tfoot th {
    text-align: right;
  }
</style>
