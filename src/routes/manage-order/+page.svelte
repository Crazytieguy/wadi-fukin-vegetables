<script lang="ts">
  import VegetableImg from '$lib/VegetableImg.svelte';
import { onDestroy } from 'svelte';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const {
    form: createOrderForm,
    enhance: createFormEnhance,
    delayed: createFormDelayed
  } = superForm(data.createOrderForm);

  const {
    form: closeOrderForm,
    enhance: closeFormEnhance,
    constraints: closeOrderConstraints,
    delayed: closeFormDelayed
  } = superForm(data.closeOrderForm);

  $: orderIsActive = data.mostRecentOrder?.isActive;

  let dialog: HTMLDialogElement;
  const openModal = () => {
    document.documentElement.classList.remove('modal-is-closing');
    document.documentElement.classList.add('modal-is-open', 'modal-is-opening');
    setTimeout(() => {
      document.documentElement.classList.remove('modal-is-opening');
    }, 400);
    dialog.showModal();
  };
  const closeModal = () => {
    document.documentElement.classList.remove('modal-is-opening');
    document.documentElement.classList.add('modal-is-closing');
    setTimeout(() => {
      document.documentElement.classList.remove('modal-is-closing', 'modal-is-open');
      dialog.close();
    }, 400);
  };
  onDestroy(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove(
        'modal-is-open',
        'modal-is-opening',
        'modal-is-closing'
      );
    }
  });
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
            <VegetableImg name={name} imageUrl={imageUrl} />
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
<dialog bind:this={dialog}>
  <article>
    <h3>Are you sure?</h3>
    <footer>
      <button class="contrast" on:click={closeModal}> Cancel </button>
      {#if orderIsActive}
        <button form="closeOrder" aria-busy={$closeFormDelayed}>Close Order</button>
      {:else}
        <button form="createOrder" aria-busy={$createFormDelayed}>Create Order</button>
      {/if}
    </footer>
  </article>
</dialog>
<button class="secondary" on:click={openModal} aria-busy={$createFormDelayed || $closeFormDelayed}>
  {#if orderIsActive}
    Close Order
  {:else}
    Create Order
  {/if}
</button>

<style>
  dialog button {
    display: inline-block;
    width: auto;
    margin-inline: 0.5rem;
  }
</style>
