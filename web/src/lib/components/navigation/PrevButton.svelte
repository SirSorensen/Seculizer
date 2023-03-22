<script lang="ts">
  import type { Frame } from "$lib/models/Frame";

  export let navigation: {
    prev: Frame | null;
    nextOptions: { name: string; frame: Frame }[];
  } = {
    prev: null,
    nextOptions: [],
  };

  export let prevFrame: () => void = () => {};
</script>

{#if navigation.prev !== null}
  <button on:click={() => prevFrame()}>Back</button>
{/if}
