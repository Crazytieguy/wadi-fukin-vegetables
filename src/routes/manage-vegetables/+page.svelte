<script lang="ts">
  import VegetableImg from '$lib/VegetableImg.svelte';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  let fileInput: HTMLInputElement;
  let mainForm: HTMLElement;

  const { form, constraints, enhance, delayed } = superForm(data.form, {
    resetForm: true,
    taintedMessage: null,
    onUpdated({ form }) {
      if (form.valid) {
        fileInput.value = '';
      }
    }
  });

  const cancel = () => {
    $form.replaceId = undefined;
    $form.name = '';
    $form.unit = 'Kg';
    $form.pricePerUnit = 0;
  };
</script>

<h1>Manage Vegetables</h1>

<form method="POST" use:enhance>
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
  <section class="flex">
    {#each data.vegetables as { id, name, unit, pricePerUnit, ...imageProps } (id)}
      <article class="vegetable" class:editing={$form.replaceId === id}>
        <p>
          <VegetableImg {name} {...imageProps} />
        </p>
        <hgroup>
          <h3>
            {#if $form.replaceId === id}
              {$form.name}
            {:else}
              {name}
            {/if}
          </h3>
          <h4>
            <strong>
              ₪ {#if $form.replaceId === id}
                {$form.pricePerUnit}
              {:else}
                {pricePerUnit}
              {/if}
            </strong>
            per {#if $form.replaceId === id}
              {$form.unit}
            {:else}
              {unit}
            {/if}
          </h4>
        </hgroup>
        {#if $form.replaceId === id}
          <button class="contrast round" on:click|preventDefault={cancel}>✕</button>
        {:else}
          <button
            class="secondary round"
            on:click|preventDefault={() => {
              $form.replaceId = id;
              $form.name = name;
              $form.unit = unit;
              $form.pricePerUnit = pricePerUnit;
              mainForm.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            ✎
          </button>
        {/if}
      </article>
    {/each}
  </section>
</form>

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
    min-width: 4rem;
    margin-bottom: var(--spacing);
  }
  .round {
    border-radius: 50%;
  }
  .vegetable button {
    margin-bottom: 0;
  }
  button {
    width: auto;
  }
  .editing {
    outline: 2px solid var(--form-element-valid-active-border-color);
  }
</style>
