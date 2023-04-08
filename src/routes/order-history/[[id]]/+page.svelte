<script lang="ts">
  import VegetableImg from '$lib/VegetableImg.svelte';

  export let data;
  const vegetableById = new Map(data.vegetables.map((vegetable) => [vegetable.id, vegetable]));

  const userNames = new Map(data.users.map((user) => [user.id, user.name]));
  userNames.set('total', 'Total');

  let userOrderVegetablesByUser: Map<string, Map<string, number>>;
  $: {
    userOrderVegetablesByUser = new Map();
    const totalOrderVegetables = new Map();
    userOrderVegetablesByUser.set('total', totalOrderVegetables);
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
  }
</script>

{#each [...userOrderVegetablesByUser] as [userId, orderVegetables]}
  <details>
    <!-- svelte-ignore a11y-no-redundant-roles -->
    <summary role="button" class="outline">
      <hgroup>
        <h4>
          {userNames.get(userId)}
        </h4>
        <h5>
          ₪ {[...orderVegetables].reduce(
            (total, [vegetableId, quantity]) =>
              total + (vegetableById.get(vegetableId)?.pricePerUnit || 0) * quantity,
            0
          )}
        </h5>
      </hgroup>
    </summary>
    <table role="grid">
      <tbody>
        {#each [...orderVegetables] as [vegetableId, quantity]}
          <tr>
            <td>
              <VegetableImg
                imageUrl={vegetableById.get(vegetableId)?.imageUrl}
                name={vegetableById.get(vegetableId)?.name}
              />
            </td>
            <td>
              <hgroup>
                <h5>
                  {vegetableById.get(vegetableId)?.name}
                </h5>
                <h6>
                  {quantity}
                  {vegetableById.get(vegetableId)?.unit}
                </h6>
              </hgroup>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </details>
{/each}

<style>
  h4,
  hgroup {
    margin: 0;
  }
</style>
