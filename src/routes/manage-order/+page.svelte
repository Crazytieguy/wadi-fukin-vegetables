<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const { form: createOrderForm, enhance: createFormEnhance } = superForm(data.createOrderForm);

  const {
    form: closeOrderForm,
    enhance: closeFormEnhance,
    constraints: closeOrderConstraints
  } = superForm(data.closeOrderForm);

  $: console.log({ $createOrderForm, $closeOrderForm, order: data.mostRecentOrder });

  $: orderIsActive = data.mostRecentOrder?.isActive;
</script>

<h1>Manage Order</h1>
<form method="POST" action="?/closeOrder" id="closeOrder" use:closeFormEnhance>
  <input type="hidden" name="id" value={data.mostRecentOrder?.id} {...$closeOrderConstraints.id} />
</form>
<form method="POST" action="?/createOrder" id="createOrder" use:createFormEnhance>
  <table>
    <tbody>
      {#each data.vegetables as { id, name, imageUrl } (id)}
        <tr>
          <td>
            <img src={imageUrl} alt={name} />
          </td>
          <td>
            <h3>
              {name}
            </h3>
            <input
              type="checkbox"
              name="vegetableIds"
              value={id}
              disabled={orderIsActive}
              role="switch"
              bind:group={$createOrderForm.vegetableIds}
            />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</form>
{#if orderIsActive}
  <button class="secondary" form="closeOrder">Close Order</button>
{:else}
  <button class="secondary" form="createOrder">Create Order</button>
{/if}
