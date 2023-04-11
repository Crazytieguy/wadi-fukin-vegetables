<script lang="ts">
  import VegetableImg from '$lib/VegetableImg.svelte';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const { form, enhance, delayed } = superForm(data.form);
</script>

<h1>Create Order</h1>
<form method="POST" use:enhance>
  <section class="flex">
    {#each data.vegetables as { id, name, ...imageProps } (id)}
      <article class="vegetable">
        <p>
          <VegetableImg {name} {...imageProps} />
        </p>
        <h3>
          {name}
        </h3>
        <input
          type="checkbox"
          name="vegetableIds"
          value={id}
          role="switch"
          bind:group={$form.vegetableIds}
        />
      </article>
    {/each}
  </section>
  <button class="secondary" aria-busy={$delayed}>Create Order</button>
</form>

<style>
  h3,
  p {
    margin-block: 0.5rem;
  }
  button {
    width: auto;
    padding-inline: 2rem;
    margin-inline: auto;
  }
</style>
