<script lang="ts">
  export let data;

  $: orderedItems = data.order?.userOrderVegetables || [];
  $: total = orderedItems.reduce(
    (sum, { vegetable, quantity }) => sum + vegetable.pricePerUnit * quantity,
    0
  );
  $: itemsByCategory = orderedItems.reduce(
    (categories: Record<string, typeof orderedItems>, item) => {
      const category = item.vegetable.category || 'No Category';
      (categories[category] = categories[category] || []).push(item);
      return categories;
    },
    {}
  );
</script>

<h1>Order Submitted Successfully!</h1>

{#if orderedItems.length > 0}
  <article>
    <h2>Your Order Summary</h2>
    {#each Object.entries(itemsByCategory) as [category, items]}
      <h3>{category}</h3>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {#each items as { vegetable, quantity }}
            <tr>
              <td>{vegetable.name}</td>
              <td>{quantity} {vegetable.unit}</td>
              <td>₪{(vegetable.pricePerUnit * quantity).toFixed(2)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/each}
    <h3>Total: ₪{total.toFixed(2)}</h3>
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
