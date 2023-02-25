<script>
  import { page } from '$app/stores';
</script>

<li><a href="/choose-vegetables">Choose Vegetables</a></li>
<li><a href="/order-history">Order History</a></li>
{#if $page.data.session?.user?.isAdmin}
  <li><a href="/add-vegetables">Add Vegetables</a></li>
  <li><a href="/manage-order">Manage Order</a></li>
{/if}
