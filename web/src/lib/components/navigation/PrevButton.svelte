<script lang="ts">
  import type { Navigation } from "src/types/app";

  export let navigation: Navigation = {
    prev: null,
    next: null,
  };

  export let prevFrame: () => void = () => {};
</script>

{#if navigation.prev !== null}
  <button on:click={() => prevFrame()}>Back</button>
{/if}
