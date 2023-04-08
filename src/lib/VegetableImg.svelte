<script lang="ts">
  export let name: string | undefined;
  export let imageUrl: string | undefined;
</script>

<img height="400" width="400" src={imageUrl} alt={name} loading="lazy" />
