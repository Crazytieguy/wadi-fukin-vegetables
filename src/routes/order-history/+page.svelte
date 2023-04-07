<script lang="ts">
  export let data;

  const vegetableById = new Map(data.vegetables.map((vegetable) => [vegetable.id, vegetable]));

  const userNames = new Map(data.users.map((user) => [user.id, user.name]));
  userNames.set('total', 'Total');

  const orderVegetablesByUser = (
    userOrderVegetables: (typeof data.orders)[0]['userOrderVegetables']
  ) => {
    const userOrderVegetablesByUser: Map<string, Map<string, number>> = new Map();
    const totalOrderVegetables = new Map();
    userOrderVegetablesByUser.set('total', totalOrderVegetables);
    for (const { userId, vegetableId, quantity } of userOrderVegetables) {
      const orderVegetables = userOrderVegetablesByUser.get(userId) || new Map();
      const accumulatedQuantity = orderVegetables.get(vegetableId) || 0;
      orderVegetables.set(vegetableId, accumulatedQuantity + quantity);
      userOrderVegetablesByUser.set(userId, orderVegetables);
      const accumulatedTotalQuantity = totalOrderVegetables.get(vegetableId) || 0;
      totalOrderVegetables.set(vegetableId, accumulatedTotalQuantity + quantity);
    }
    return userOrderVegetablesByUser;
  };
</script>

<h1>Order History</h1>

{#each data.orders as { id, isActive, updatedAt, userOrderVegetables } (id)}
  <details>
    <!-- svelte-ignore a11y-no-redundant-roles -->
    <summary role="button" class="secondary">
      <h3>
        {updatedAt.toLocaleDateString()}
        {isActive ? '(active)' : ''}
      </h3>
    </summary>
    {#each [...orderVegetablesByUser(userOrderVegetables)] as [userId, orderVegetables]}
      <details>
        <!-- svelte-ignore a11y-no-redundant-roles -->
        <summary role="button" class="outline">
          <h4>
            <span>{userNames.get(userId)}: </span>₪ {[...orderVegetables].reduce(
              (total, [vegetableId, quantity]) =>
                total + (vegetableById.get(vegetableId)?.pricePerUnit || 0) * quantity,
              0
            )}
          </h4>
        </summary>
        <table role="grid">
          <tbody>
            {#each [...orderVegetables] as [vegetableId, quantity]}
              <tr>
                <td>
                  <img
                    src={vegetableById.get(vegetableId)?.imageUrl}
                    alt={vegetableById.get(vegetableId)?.name}
                  />
                </td>
                <td>
                  <h5>
                    {vegetableById.get(vegetableId)?.name}
                  </h5>
                  <h6>
                    {quantity}
                    {vegetableById.get(vegetableId)?.unit}
                  </h6>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </details>
    {/each}
  </details>
{/each}

<style>
  h3,
  h4 {
    margin-bottom: 0;
  }
  details details {
    margin-left: 1em;
  }
  table {
    max-width: 32rem;
    margin-inline: auto;
  }
</style>
