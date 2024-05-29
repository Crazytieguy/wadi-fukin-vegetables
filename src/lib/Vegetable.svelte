<script lang="ts">
  import { fill } from '@cloudinary/url-gen/actions/resize';
  import type { Vegetable } from '@prisma/client';
  import { cld } from './cloudinaryClient';

  export let vegetable: Vegetable;
  $: ({ name, imagePublicId, imageOriginalWidth, imageOriginalHeight } = vegetable);

  // images are 250px max
  $: size = Math.max(250, Math.min(500, imageOriginalWidth, imageOriginalHeight));
  $: url = cld.image(imagePublicId).resize(fill(size, size)).format('auto').quality('auto').toURL();
</script>

<article {...$$restProps}>
  <header>
    <img height={size} width={size} src={url} alt={name} />
  </header>
  <hgroup>
    <h4>{vegetable.name}</h4>
    {#if vegetable.sellerName}
      <h5>{vegetable.sellerName}</h5>
    {/if}
    <h5>
      <slot name="subtitle">
        <strong>₪ {vegetable.pricePerUnit}</strong> per {vegetable.unit}
      </slot>
    </h5>
  </hgroup>
  {#if $$slots.default}
    <footer>
      <slot />
    </footer>
  {/if}
</article>

<style>
  img {
    border-top-right-radius: inherit;
    border-top-left-radius: inherit;
  }
  header {
    padding: 0;
  }
  article {
    --block-spacing-vertical: var(--spacing);
    --block-spacing-horizontal: var(--spacing);
    --border-radius: 0.75rem;
    --card-border-color: var(--secondary);
    display: flex;
    flex-direction: column;
  }
  footer {
    margin-top: auto;
  }
</style>
