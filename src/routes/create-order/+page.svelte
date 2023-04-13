<script lang="ts">
  import Vegetable from '$lib/Vegetable.svelte';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const { form, enhance, delayed } = superForm(data.form);
</script>

<h1>Create Order</h1>
<form method="POST" use:enhance>
  <section class="vegetable-grid">
    {#each data.vegetables as vegetable (vegetable.id)}
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
