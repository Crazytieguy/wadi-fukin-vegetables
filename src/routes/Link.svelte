<script lang="ts">
  import { page } from '$app/stores';

  export let label: string;
  export let href: string;
</script>

<li>
  {#if href == $page.url.pathname}
    {label}
  {:else}
    <a {href}>{label}</a>
  {/if}
</li>
