<script lang="ts">
  import Fuse from 'fuse.js';
  import Vegetable from '$lib/Vegetable.svelte';
  import { groupBy } from '$lib/utils';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const { form, enhance, delayed } = superForm(data.form);

  $: fuse = new Fuse(data.vegetables, {
    keys: ['name', 'sellerName', 'category']
  });

  let search = '';

  $: vegetables = search ? fuse.search(search).map((result) => result.item) : data.vegetables;

  $: vegetablesByCategory = groupBy(vegetables, (v) => v.category || 'No Category');

  function allSelected(vegs: typeof vegetables, selectedIds: string[]) {
    return vegs.every((v) => selectedIds.includes(v.id));
  }

  function someSelected(vegs: typeof vegetables, selectedIds: string[]) {
    return vegs.some((v) => selectedIds.includes(v.id));
  }

  function toggleCategory(vegs: typeof vegetables) {
    const ids = vegs.map((v) => v.id);
    if (allSelected(vegs, $form.vegetableIds)) {
      $form.vegetableIds = $form.vegetableIds.filter((id) => !ids.includes(id));
    } else {
      $form.vegetableIds = [...new Set([...$form.vegetableIds, ...ids])];
    }
  }
</script>

<h1>Create Order</h1>
<search>
  <label>
    <p>Search:</p>
    <input type="text" bind:value={search} />
  </label>
</search>
<form method="POST" use:enhance>
  {#each [...vegetablesByCategory] as [category, vegs] (category)}
    <details open>
      <summary>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <label class="category-toggle" on:click|stopPropagation>
          <input
            type="checkbox"
            checked={allSelected(vegs, $form.vegetableIds)}
            indeterminate={someSelected(vegs, $form.vegetableIds) && !allSelected(vegs, $form.vegetableIds)}
            on:change={() => toggleCategory(vegs)}
          />
          {category}
        </label>
      </summary>
      <section class="vegetable-grid">
        {#each vegs as vegetable (vegetable.id)}
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
    </details>
  {/each}
  <button class="secondary" aria-busy={$delayed}>Create Order</button>
</form>

<style>
  button {
    width: auto;
    padding-inline: 2rem;
    margin-inline: auto;
  }
  summary {
    font-size: 1.5rem;
  }
  .category-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    margin-bottom: 0;
  }
  .category-toggle input[type='checkbox'] {
    margin-bottom: 0;
  }
</style>
