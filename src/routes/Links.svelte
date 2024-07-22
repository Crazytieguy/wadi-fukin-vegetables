<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import Link from './Link.svelte';

  export let isAdmin: boolean | undefined;
  const publicLinks = [
    { href: '/', label: 'Choose Vegetables' },
    { href: '/order-history', label: 'Order History' }
  ];
  const adminLinks = [
    { href: '/manage-vegetables', label: 'Manage Vegetables' },
    { href: '/create-order', label: 'Create Order' },
    { href: '/manage-admins', label: 'Manage Admins' },
    { href: '/manage-categories', label: 'Manage Categories' }
  ];

  let detailsOpen = false;

  afterNavigate(() => (detailsOpen = false));
</script>

{#each publicLinks as link}
  <Link {...link} />
{/each}
{#if isAdmin}
  <li role="list">
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a href="#" aria-haspopup="listbox">Admin</a>
    <ul role="listbox">
      {#each adminLinks as link}
        <Link {...link} />
      {/each}
    </ul>
  </li>
{/if}
