<script lang="ts">
  import { crop } from '@cloudinary/url-gen/actions/resize';
  import { cld } from './cloudinaryClient';

  export let name: string;
  export let imagePublicId: string;
  export let imageOriginalWidth: number;
  export let imageOriginalHeight: number;

  // I want an aspect ratio of 1, and 480px is twice the maximum browser pixel size of the images
  const size = Math.min(imageOriginalWidth, imageOriginalHeight, 480);
  const url = cld
    .image(imagePublicId)
    .resize(crop(size, size))
    .format('auto')
    .quality('auto')
    .toURL();
</script>

<img height={size} width={size} src={url} alt={name} />
