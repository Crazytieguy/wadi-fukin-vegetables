<script lang="ts">
  import { fill } from '@cloudinary/url-gen/actions/resize';
  import { cld } from './cloudinaryClient';
  import type { Vegetable } from '@prisma/client';

  export let vegetable: Vegetable;
  $: ({ name, imagePublicId, imageOriginalWidth, imageOriginalHeight } = vegetable);

  // I want an aspect ratio of 1, and 400px is twice the maximum browser pixel size of the images
  $: size = Math.max(200, Math.min(400, imageOriginalWidth, imageOriginalHeight));
  $: url = cld.image(imagePublicId).resize(fill(size, size)).format('auto').quality('auto').toURL();
</script>

<img height={size} width={size} src={url} alt={name} />

<style>
  img {
    max-width: min(200px, 100%);
    border-radius: 10%;
    border: 0.2rem outset black;
  }
</style>
