<script lang="ts">
  import Fuse from 'fuse.js';
  import Vegetable from '$lib/Vegetable.svelte';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const { form, enhance, delayed } = superForm(data.form);

  $: fuse = new Fuse(data.vegetables, {
    keys: ['name', 'sellerName', 'category']
  });

  let search = '';

  $: vegetables = search ? fuse.search(search).map((result) => result.item) : data.vegetables;
</script>

<h1>Create Order</h1>
<search>
  <label>
    <p>Search:</p>
    <input type="text" bind:value={search} />
  </label>
</search>
<form method="POST" use:enhance>
  <section class="vegetable-grid">
    {#each vegetables as vegetable (vegetable.id)}
      <Vegetable {vegetable}>
        <div slot="subtitle" />
        <input
          type="checkbox"
          name="vegetableIds"
          value={vegetable.id}
          role="switch"
          bind:group={$form.vegetableIds}
        />
      </Vegetable>
    {/each}
  </section>
  <button class="secondary" aria-busy={$delayed}>Create Order</button>
</form>

<style>
  button {
    width: auto;
    padding-inline: 2rem;
    margin-inline: auto;
  }
</style>
