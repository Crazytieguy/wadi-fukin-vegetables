<script lang="ts">
  import Vegetable from '$lib/Vegetable.svelte';
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

  let vegIdQuantityToVegQuantity = ([vegetableId, quantity]: [string, number]) => {
    let veg = vegetableById.get(vegetableId);
    if (!veg) return [];
    return [[veg, quantity]] as const;
  };
</script>

{#each [...userOrderVegetablesByUser] as [userId, orderVegetables]}
  <details>
    <!-- svelte-ignore a11y-no-redundant-roles -->
    <summary role="button" class="outline">
      <hgroup>
        <h4>{userNames.get(userId)}</h4>
        <h5>
          ₪ {[...orderVegetables].reduce(
            (total, [vegetableId, quantity]) =>
              total + (vegetableById.get(vegetableId)?.pricePerUnit || 0) * quantity,
            0
          )}
        </h5>
      </hgroup>
    </summary>
    <section class="vegetable-grid">
      {#each [...orderVegetables].flatMap(vegIdQuantityToVegQuantity) as [vegetable, quantity]}
        <Vegetable {vegetable}>
          <div slot="subtitle" />
          <h5>
            {quantity}
            {vegetable.unit}
          </h5>
        </Vegetable>
      {/each}
    </section>
  </details>
{/each}
{#if data.order?.isActive && data.user.isAdmin}
  <form method="POST" use:enhance>
    <input type="hidden" name="id" value={data.order.id} {...$constraints.id} />
    <button class="secondary" aria-busy={$delayed}>Close Active Order</button>
  </form>
{/if}

<style>
  h4,
  h5,
  hgroup {
    margin: 0;
  }
  button {
    width: auto;
  }
</style>
