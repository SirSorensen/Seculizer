<script lang="ts">
  import type { Frame } from "$lib/models/Frame";
  import type { Navigation, NextFrameNavigation } from "src/types/app";

  export let navigation: Navigation = {
    prev: null,
    next: null,
  };

  export let nextFrame: NextFrameNavigation= () => {};
</script>

{#if navigation.next !== null}
  <button on:click={() => {if(navigation.next !== null) nextFrame(navigation.next)}}>Next</button>
{/if}
