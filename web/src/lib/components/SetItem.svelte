<script lang="ts">
  import type { Type } from "$lang/types/parser/interfaces";
  
  import { getStringFromType } from "$lib/utils/stringUtil";
  import { fade } from "svelte/transition";
  import Emoji from "./Emoji.svelte";
  import Latex from "./Latex.svelte";
  export let emoji: string;
  export let value: Type;
  export let newValue: Type;
  import { program } from "$lib/stores/programStore.js";
</script>

<div transition:fade={{ delay: 250, duration: 300 }} class="item">
  <Emoji content={emoji} />
  <p>
    {#if $program.getFormats().contains(value)}
      {@const format = $program.getFormats().getConstructedLatex(value)}
      <Latex input={format} />
    {:else}
      {getStringFromType(value)}
    {/if}
    =
    {#if $program.getFormats().contains(newValue)}
      {@const format = $program.getFormats().getConstructedLatex(newValue)}
      <Latex input={format} />
    {:else}
      {getStringFromType(newValue)}
    {/if}
  </p>
</div>

<style>
  .item :global(.emoji) {
    font-size: 3rem;
  }

  .item {
    padding: 1rem;
    text-align: center;
  }

  p {
    margin: 0;
  }
</style>
