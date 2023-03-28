<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const { form, errors, constraints, enhance } = superForm(data.form, { resetForm: true });
</script>

<h1>Manage Vegetables</h1>

<form method="POST" use:enhance>
  <table role="grid">
    <thead>
      <tr>
        <th scope="col">Image</th>
        <th scope="col">Name</th>
        <th scope="col">Unit</th>
        <th scope="col">Price</th>
      </tr>
    </thead>
    <tbody>
      {#each data.vegetables as { id, name, imageUrl, unit, pricePerUnit } (id)}
        <tr>
          <td>
            <img src={imageUrl} alt={name} />
          </td>
          <td>{name}</td>
          <td>{unit}</td>
          <td>₪{pricePerUnit.toFixed(2)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  <artice>
    <div class="grid">
      <label>
        Name:
        <input
          type="text"
          name="name"
          data-invalid={$errors.name}
          bind:value={$form.name}
          {...$constraints.name}
        />
      </label>
      <label>
        Image:
        <input type="file" accept="image/*" name="image" required />
      </label>
    </div>
    <div class="grid">
      <label>
        Unit:
        <input
          type="text"
          name="unit"
          data-invalid={$errors.unit}
          bind:value={$form.unit}
          {...$constraints.unit}
        />
      </label>
      <label>
        Price:
        <input
          type="number"
          name="pricePerUnit"
          data-invalid={$errors.pricePerUnit}
          bind:value={$form.pricePerUnit}
          {...$constraints.pricePerUnit}
        />
      </label>
    </div>
  </artice>
  <button class="secondary">Add Vegetable</button>
</form>
