<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';

  export let data;
  const { enhance, constraints, delayed } = superForm(data.form);

  const vegetableById = new Map(data.vegetables.map((vegetable) => [vegetable.id, vegetable]));

  const userNames = new Map(data.users.map((user) => [user.id, user.name]));
  userNames.set('total', 'Total');

  let userOrderVegetablesByUser: Map<string, Map<string, number>>;
  $: {
    userOrderVegetablesByUser = new Map();
    const totalOrderVegetables = new Map();
    (data.order?.userOrderVegetables || [])
      .filter(({ quantity }) => quantity > 0)
      .forEach(({ userId, vegetableId, quantity }) => {
        const orderVegetables = userOrderVegetablesByUser.get(userId) || new Map();
        const accumulatedQuantity = orderVegetables.get(vegetableId) || 0;
        orderVegetables.set(vegetableId, accumulatedQuantity + quantity);
        userOrderVegetablesByUser.set(userId, orderVegetables);
        const accumulatedTotalQuantity = totalOrderVegetables.get(vegetableId) || 0;
        totalOrderVegetables.set(vegetableId, accumulatedTotalQuantity + quantity);
      });
    userOrderVegetablesByUser.set('total', totalOrderVegetables);
  }

  let vegIdQuantityToVegQuantity = ([vegetableId, quantity]: [string, number]) => {
    let veg = vegetableById.get(vegetableId);
    if (!veg) return [];
    return [[veg, quantity]] as const;
  };
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
    {#each [...userOrderVegetablesByUser] as [userId, orderVegetables]}
      <tr>
        <td>
          {userNames.get(userId)}
        </td>
        <td>
          ₪ {[...orderVegetables].reduce(
            (total, [vegetableId, quantity]) =>
              total + (vegetableById.get(vegetableId)?.pricePerUnit || 0) * quantity,
            0
          )}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<h2>Order Details</h2>

{#each [...userOrderVegetablesByUser] as [userId, orderVegetables]}
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
        {#each [...orderVegetables].flatMap(vegIdQuantityToVegQuantity) as [vegetable, quantity]}
          <tr>
            <td>{vegetable.name}</td>
            <td>
              {quantity}
              {vegetable.unit}
            </td>
          </tr>
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
  table {
    table-layout: fixed;
  }
  thead th:first-child {
    width: 60%;
  }
</style>
