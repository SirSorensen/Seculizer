<script lang="ts">
  import type { Frame } from "$lib/models/Frame";


  export let navigation: {
    prev: Frame | null;
    nextOptions: { name: string; frame: Frame }[];
  } = {
    prev: null,
    nextOptions: [],
  };

  export let nextFrame: (frame: Frame) => void = () => {};
</script>

{#if navigation.nextOptions.length > 0}
  {#if navigation.nextOptions.length === 1}
    <button on:click={() => nextFrame(navigation.nextOptions[0].frame)}
      >Next</button
    >
  {:else}
    {#each navigation.nextOptions as option}
      <button on:click={() => nextFrame(option.frame)}>{option.name}</button>
    {/each}
  {/if}
{/if}
