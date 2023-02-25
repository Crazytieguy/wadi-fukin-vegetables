<script>
  import { page } from '$app/stores';

  const links = [
    { href: '/', label: 'Home' },
    { href: '/choose-vegetables', label: 'Choose Vegetables' },
    { href: '/order-history', label: 'Order History' },
    { href: '/add-vegetables', label: 'Add Vegetables', adminOnly: true },
    { href: '/manage-order', label: 'Manage Order', admin: true }
  ];
</script>

{#each links as link}
  {#if !link.adminOnly || $page.data.session?.user?.isAdmin}
    <li>
      {#if link.href == $page.url.pathname}
        {link.label}
      {:else}
        <a href={link.href}>{link.label}</a>
      {/if}
    </li>
  {/if}
{/each}
