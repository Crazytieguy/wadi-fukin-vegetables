<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData, PageData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  if (form?.errors) {
    console.log(form.errors);
  }
</script>

<h1>Manage Vegetables</h1>

{#if form?.errors}
  <article>There was an error submitting the vegetable</article>
{/if}

<form method="POST" use:enhance>
  <table role="grid">
    <thead>
      <tr>
        <th scope="col">Image</th>
        <th scope="col">Name</th>
        <th scope="col">Unit</th>
      </tr>
    </thead>
    <tbody>
      {#each data.vegetables as vegetable (vegetable.id)}
        <tr>
          <td>
            <img src={vegetable.imageUrl} alt={vegetable.name} />
          </td>
          <td>{vegetable.name} </td>
          <td>{vegetable.unit}</td>
        </tr>
      {/each}
    </tbody>
    <tfoot>
      <tr>
        <td>
          <input type="file" accept="image/*" name="image" required />
        </td>
        <td>
          <input type="text" name="name" required />
        </td>
        <td>
          <input type="text" name="unit" required />
        </td>
      </tr>
    </tfoot>
  </table>
  <button class="secondary">Add Vegetable</button>
</form>
