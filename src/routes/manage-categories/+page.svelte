<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const { form, enhance, delayed, submitting, constraints } = superForm(data.form, {
    dataType: 'json',
    invalidateAll: true
  });
</script>

<h1>Manage Categories</h1>
<form class="columns" method="POST" use:enhance>
  <h2>Name</h2>
  <h2>Category</h2>
  {#each data.vegetables as { id, name }, i (id)}
    <label for={id}>{name}</label>
    <input
      type="text"
      name="category"
      {id}
      bind:value={$form.categories[i].category}
      {...$constraints.categories?.category}
    />
  {/each}
  <button aria-busy={$delayed} disabled={$submitting}>Save</button>
</form>

<style>
  .columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }
</style>
