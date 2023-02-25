<script>
  import { page } from '$app/stores';
</script>

{#if $page.status == 403}
  <h1>Access Denied</h1>
  <p>You must be an admin to view this page</p>
{:else if $page.status == 401}
  <h1>Access Denied</h1>
  <p>
    You must be <a href="/auth/signin" data-sveltekit-preload-data="off">signed in</a> to view this page
  </p>
{:else}
  <h1>Error</h1>
  <p>{$page.error?.message}</p>
{/if}
