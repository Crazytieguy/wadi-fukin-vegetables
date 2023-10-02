<script>
  import { page } from '$app/stores';
  console.log($page.error);
</script>

{#if $page.status == 403}
  <h1>Access Denied</h1>
  <p>You must be an admin to view this page</p>
{:else if $page.status == 401}
  <h1>Wadi Fukin Vegetables!</h1>
  <p>This is an application for vegetable group orders from Wadi Fukin.</p>
  <p><a href="/auth/signin" data-sveltekit-preload-data="off">Sign in</a> to choose vegetables</p>
{:else}
  <h1>Error</h1>
  <p>{$page.error?.message}</p>
{/if}
