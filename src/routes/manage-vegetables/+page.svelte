<script lang="ts">
    import VegetableImg from '$lib/VegetableImg.svelte';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const { form, errors, constraints, enhance, delayed } = superForm(data.form, { resetForm: true });
</script>

<h1>Manage Vegetables</h1>

<form method="POST" use:enhance>
  <table role="grid">
    <tbody>
      {#each data.vegetables as { id, name, imageUrl, unit, pricePerUnit } (id)}
        <tr>
          <td>
            <VegetableImg name={name} imageUrl={imageUrl} />
          </td>
          <td>
            <hgroup>
              <h3>
                {name}
              </h3>
              <p>
                <strong>
                  ₪ {pricePerUnit}
                </strong>
                per {unit}
              </p>
            </hgroup>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  <artice>
    <div class="grid">
      <label>
        <p>Name:</p>
        <input
          type="text"
          name="name"
          data-invalid={$errors.name}
          bind:value={$form.name}
          {...$constraints.name}
        />
      </label>
      <label>
        <p>Unit:</p>
        <input
          type="text"
          name="unit"
          data-invalid={$errors.unit}
          bind:value={$form.unit}
          {...$constraints.unit}
        />
      </label>
    </div>
    <div class="grid">
      <label>
        <p>Price:</p>
        <input
          type="number"
          name="pricePerUnit"
          data-invalid={$errors.pricePerUnit}
          bind:value={$form.pricePerUnit}
          {...$constraints.pricePerUnit}
        />
      </label>
      <label>
        <p>Image:</p>
        <input type="file" accept="image/*" name="image" required />
      </label>
    </div>
  </artice>
  <button class="secondary" aria-busy={$delayed}>Add Vegetable</button>
</form>

<style>
  label {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  label p {
    min-width: 3rem;
  }
</style>
