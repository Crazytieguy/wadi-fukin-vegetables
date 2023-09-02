<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const { form, enhance, delayed, submitting } = superForm(data.form, {
    dataType: 'json',
    invalidateAll: true
  });

  let formElement: HTMLFormElement;
</script>

<h1>Manage Admins</h1>
<form class="columns" method="POST" use:enhance bind:this={formElement}>
  <h2>Name</h2>
  <h2>Admin</h2>
  {#each data.users.filter(({ id }) => id != data.user.id) as { id, name, isAdmin } (id)}
    <label for={id} aria-busy={id === $form.userId && $delayed}>
      {name}
    </label>
    <input
      type="checkbox"
      role="switch"
      name="isAdmin"
      {id}
      checked={isAdmin}
      disabled={$submitting}
      on:change={(e) => {
        $form.userId = id;
        // @ts-ignore
        $form.isAdmin = e.target?.checked;
        formElement.requestSubmit();
      }}
    />
  {/each}
</form>

<style>
  .columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
</style>
