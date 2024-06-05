<script lang="ts">
  import { groupBy, reduceBy } from '$lib/utils.js';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;
  const { enhance, constraints, delayed } = superForm(data.form);

  const vegetableById = new Map(data.vegetables.map((vegetable) => [vegetable.id, vegetable]));

  const userNames = new Map(data.users.map((user) => [user.id, user.name]));
  userNames.set('total', 'Total');

  const priceReducer = (
    acc: number,
    { vegetableId, quantity }: { vegetableId: string; quantity: number }
  ) => {
    const vegetable = vegetableById.get(vegetableId);
    if (!vegetable) return 0;
    return acc + vegetable.pricePerUnit * quantity;
  };

  const sellerByVegId = ({ vegetableId }: { vegetableId: string }) =>
    vegetableById.get(vegetableId)?.sellerName || 'Unknown';

  const orderVegetablesToVegQuantities = (
    orderVegetables: {
      vegetableId: string;
      quantity: number;
    }[]
  ) => {
    return [...groupBy(orderVegetables, ({ vegetableId }) => vegetableId)].flatMap(
      ([vegetableId, orderVegetables]) => {
        const vegetable = vegetableById.get(vegetableId);
        if (!vegetable) return [];
        const quantity = orderVegetables.reduce((acc, { quantity }) => acc + quantity, 0);
        if (quantity === 0) return [];
        return [[vegetable, quantity]] as const;
      }
    );
  };

  $: userOrderVegetables = (data.order?.userOrderVegetables || []).filter(
    ({ quantity }) => quantity > 0
  );

  $: userTotals = reduceBy(userOrderVegetables, ({ userId }) => userId, priceReducer, 0);
  $: userTotals.set('total', userOrderVegetables.reduce(priceReducer, 0));

  $: sellerTotals = reduceBy(userOrderVegetables, sellerByVegId, priceReducer, 0);

  $: userSellerOrderVegetables = new Map(
    [...groupBy(userOrderVegetables, ({ userId }) => userId)].map(
      ([userId, userOrderVegetables]) => {
        return [userId, groupBy(userOrderVegetables, sellerByVegId)];
      }
    )
  );
  $: userSellerOrderVegetables.set('total', groupBy(userOrderVegetables, sellerByVegId));
  $: console.log({ userSellerOrderVegetables });
</script>

<h2>User Totals</h2>

<table>
  <thead>
    <tr>
      <th>User</th>
      <th>Total</th>
    </tr>
  </thead>
  <tbody>
    {#each [...userTotals] as [userId, total] (userId)}
      <tr>
        <td class="capitalize">
          {userNames.get(userId)}
        </td>
        <td>
          ₪ {total}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<h2>Seller Totals</h2>

<table>
  <thead>
    <tr>
      <th>Seller</th>
      <th>Total</th>
    </tr>
  </thead>
  <tbody>
    {#each [...sellerTotals] as [sellerName, total] (sellerName)}
      <tr>
        <td>
          {sellerName}
        </td>
        <td>
          ₪ {total}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<h2>Order Details</h2>

{#each [...userSellerOrderVegetables] as [userId, sellerOrderVegetables] (userId)}
  <details>
    <summary>
      {userNames.get(userId)}
    </summary>
    <table>
      <thead>
        <tr>
          <th>Vegetable</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>
        {#each [...sellerOrderVegetables] as [sellerName, orderVegetables] (sellerName)}
          <tr>
            <td colspan="2">
              <strong>{sellerName}</strong>
            </td>
          </tr>
          {#each orderVegetablesToVegQuantities(orderVegetables) as [vegetable, quantity] (vegetable.id)}
            <tr>
              <td>{vegetable.name}</td>
              <td>
                {quantity}
                {vegetable.unit}
              </td>
            </tr>
          {/each}
        {/each}
      </tbody>
    </table>
  </details>
{/each}
{#if data.order?.isActive && data.user.isAdmin}
  <form method="POST" use:enhance>
    <input type="hidden" name="id" value={data.order.id} {...$constraints.id} />
    <button class="secondary" aria-busy={$delayed}>Close Active Order</button>
  </form>
{/if}

<style>
  button {
    width: auto;
  }
  summary {
    font-weight: bold;
    text-transform: capitalize;
  }
  .capitalize {
    text-transform: capitalize;
  }
  table {
    table-layout: fixed;
  }
  thead th:first-child {
    width: 60%;
  }

  td[colspan='2'] {
    text-align: center;
  }
</style>
