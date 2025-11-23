<script lang="ts">
  import Vegetable from '$lib/Vegetable.svelte';
  import Fuse from 'fuse.js';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  let fileInput: HTMLInputElement;
  let mainForm: HTMLElement;
  let deleteMode = false;

  const { form, constraints, enhance, delayed } = superForm(data.form, {
    id: 'create',
    resetForm: true,
    taintedMessage: null,
    onUpdated({ form }) {
      if (form.valid) {
        fileInput.value = '';
      }
    }
  });

  const {
    form: deleteForm,
    enhance: deleteEnhance,
    delayed: deleteDelayed
  } = superForm(data.deleteForm, {
    id: 'delete',
    resetForm: true,
    taintedMessage: null,
    onUpdated() {
      closeModal();
      deleteMode = false;
      $deleteForm.vegetableIds = [];
    }
  });

  const cancel = () => {
    $form.replaceId = undefined;
    $form.name = '';
    $form.unit = 'Kg';
    $form.pricePerUnit = 0;
    $form.sellerName = '';
    $form.category = '';
  };

  $: fuse = new Fuse(data.vegetables, {
    keys: ['name', 'sellerName', 'category']
  });

  let search = '';

  $: vegetables = search ? fuse.search(search).map((result) => result.item) : data.vegetables;

  $: selectedVegetableCount = $deleteForm.vegetableIds?.length || 0;

  $: selectedVegetableNames = vegetables
    .filter((v) => $deleteForm.vegetableIds?.includes(v.id))
    .map((v) => v.name);

  const openDeleteConfirmation = () => {
    if (selectedVegetableCount === 0) return;

    const modal = document.getElementById('delete-confirmation') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  const closeModal = () => {
    const modal = document.getElementById('delete-confirmation') as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };
</script>

<h1>Manage Vegetables</h1>

<form method="POST" action="?/create" enctype="multipart/form-data" use:enhance>
  {#if $form.replaceId}
    <input type="hidden" name="replaceId" value={$form.replaceId} {...$constraints.replaceId} />
  {/if}
  <artice bind:this={mainForm}>
    <div class="grid">
      <label>
        <p>Name:</p>
        <input type="text" name="name" bind:value={$form.name} {...$constraints.name} />
      </label>
      <label>
        <p>Unit:</p>
        <select name="unit" bind:value={$form.unit} {...$constraints.unit}>
          <option value="Kg">Kg</option>
          <option value="G">G</option>
          <option value="Unit">Unit</option>
        </select>
      </label>
    </div>
    <div class="grid">
      <label>
        <p>Price:</p>
        <input
          type="number"
          name="pricePerUnit"
          bind:value={$form.pricePerUnit}
          {...$constraints.pricePerUnit}
        />
      </label>
      <label>
        <p>Seller:</p>
        <input
          type="text"
          name="sellerName"
          bind:value={$form.sellerName}
          {...$constraints.sellerName}
        />
      </label>
    </div>
    <div class="grid">
      <label>
        <p>Category:</p>
        <input type="text" name="category" bind:value={$form.category} {...$constraints.category} />
      </label>
      <label>
        <p>Image:</p>
        <input
          bind:this={fileInput}
          type="file"
          accept="image/*"
          name="image"
          required={!$form.replaceId}
        />
      </label>
    </div>
    <div class="buttons">
      {#if $form.replaceId}
        <button class="contrast" on:click|preventDefault={cancel}>Cancel</button>
      {/if}
      <button aria-busy={$delayed}>
        {#if $form.replaceId}
          Update Vegetable
        {:else}
          Add Vegetable
        {/if}
      </button>
    </div>
  </artice>
</form>

<div>
  <search>
    <label>
      <p>Search:</p>
      <input type="text" bind:value={search} />
    </label>
  </search>

  <div class="flex">
    <button
      class={deleteMode ? 'contrast' : 'secondary'}
      on:click|preventDefault={() => {
        deleteMode = !deleteMode;
        if (!deleteMode) {
          $deleteForm.vegetableIds = [];
        }
      }}
    >
      {deleteMode ? 'Exit Delete Mode' : 'Delete Mode'}
    </button>

    {#if deleteMode && selectedVegetableCount > 0}
      <button class="danger" on:click|preventDefault={openDeleteConfirmation}>
        Delete Selected ({selectedVegetableCount})
      </button>
    {/if}
  </div>
</div>

<section class="vegetable-grid">
  {#each vegetables as vegetable (vegetable.id)}
    {#if $form.replaceId === vegetable.id}
      <Vegetable vegetable={{ ...vegetable, ...$form }} class="editing">
        <button class="contrast round" on:click|preventDefault={cancel}>✕</button>
      </Vegetable>
    {:else}
      <Vegetable {vegetable}>
        {#if deleteMode}
          <input
            type="checkbox"
            value={vegetable.id}
            bind:group={$deleteForm.vegetableIds}
            role="switch"
          />
        {:else}
          <button
            class="secondary round"
            on:click|preventDefault={() => {
              $form.replaceId = vegetable.id;
              $form.name = vegetable.name;
              $form.unit = vegetable.unit;
              $form.pricePerUnit = vegetable.pricePerUnit;
              $form.sellerName = vegetable.sellerName ?? '';
              $form.category = vegetable.category ?? '';
              mainForm.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            ✎
          </button>
        {/if}
      </Vegetable>
    {/if}
  {/each}
</section>

<dialog id="delete-confirmation">
  <article>
    <header>
      <button aria-label="Close" class="close" on:click={closeModal} />
      <h3>Confirm Deletion</h3>
    </header>

    <p>Are you sure you want to delete the following vegetables?</p>

    <ul>
      {#each selectedVegetableNames as name}
        <li>{name}</li>
      {/each}
    </ul>

    <p>This action cannot be undone.</p>

    <footer>
      <form method="POST" action="?/delete" use:deleteEnhance class="grid">
        {#each $deleteForm.vegetableIds as vegetableId}
          <input type="hidden" name="vegetableIds" value={vegetableId} />
        {/each}
        <button class="secondary" on:click|preventDefault={closeModal}>Cancel</button>
        <button type="submit" class="danger" aria-busy={$deleteDelayed}>Delete</button>
      </form>
    </footer>
  </article>
</dialog>

<style>
  .buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
  label {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  label p {
    min-width: 4.5rem;
    margin-bottom: var(--spacing);
  }
  button.round {
    border-radius: 50%;
    margin-bottom: 0;
  }
  button {
    width: auto;
  }
  section :global(.editing) {
    outline: 2px solid var(--form-element-valid-active-border-color);
  }

  .danger {
    --background-color: var(--del-color);
    --border-color: var(--del-color);
    --color: var(--card-background-color);
  }
  .flex {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
</style>
