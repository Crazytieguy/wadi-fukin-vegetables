<script lang="ts">
  import { page } from '$app/stores';

  // @ts-ignore
  let isAdmin = $page.data.session?.user?.isAdmin;
  const links = [
    { href: '/', label: 'Home' },
    { href: '/choose-vegetables', label: 'Choose Vegetables' },
    { href: '/order-history', label: 'Order History' },
    { href: '/add-vegetables', label: 'Add Vegetables', adminOnly: true },
    { href: '/manage-order', label: 'Manage Order', adminOnly: true }
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
