<script lang="ts">
  import { page } from '$app/stores';

  export let isAdmin: boolean | undefined;
  const links = [
    { href: '/', label: 'Home' },
    { href: '/choose-vegetables', label: 'Choose Vegetables' },
    { href: '/order-history', label: 'Order History', adminOnly: true },
    { href: '/manage-vegetables', label: 'Manage Vegetables', adminOnly: true },
    { href: '/create-order', label: 'Create Order', adminOnly: true },
    { href: '/manage-admins', label: 'Manage Admins', adminOnly: true }
  ];
</script>

{#each links as link}
  {#if !link.adminOnly || isAdmin}
    <li>
      {#if link.href == $page.url.pathname}
        {link.label}
      {:else}
        <a href={link.href}>{link.label}</a>
      {/if}
    </li>
  {/if}
{/each}
