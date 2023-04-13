<script lang="ts">
  import type { Type } from "$lang/types/parser/interfaces";
  import { getStringFromType } from "$lib/utils/stringUtil";
  import { fade } from "svelte/transition";
  import { program } from "$lib/stores/programStore.js";
  import Emoji from "./Emoji.svelte";
  import Latex from "./Latex.svelte";
  export let emoji: string;
  export let value: Type;
  let item: HTMLElement;
  let hoverValues = { left: "0px", top: "100%" };
  function handleMouse(e: MouseEvent) {
    const { clientX, clientY } = e;
    const { left, top } = item.getBoundingClientRect();
    hoverValues.left = `${clientX - left + 10}px`;
    hoverValues.top = `${clientY - top + 10}px`;
  }
</script>

<div transition:fade={{ delay: 250, duration: 300 }} class="item" bind:this={item} on:mousemove={handleMouse}>
  <Emoji content={emoji} />
  {#if $program.getFormats().contains(value)}
    {@const format = $program.getFormats().getConstructedLatex(value)}
    <Latex input={format} />
  {:else}
    <p>{getStringFromType(value)}</p>
  {/if}
  <slot />
  {#if $$slots.hover}
    <div class="item-hover" style:left={hoverValues.left} style:top={hoverValues.top}>
      <slot name="hover" />
    </div>
  {/if}
</div>

<style>
  .item :global(.emoji i) {
    font-size: 3rem;
  }

  .item {
    padding: 0.1rem;
    text-align: center;
    position: relative;
  }

  .item .item-hover {
    position: absolute;
    top: 100%;
    left: 0;
    display: none;
    min-width: 100px;
    text-align: center;
    width: max-content;
    max-width: 300px;
    background-color: #fff3d3;
    text-align: center;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
    padding: 0.5rem;
    z-index: 10;
    font-size: 1rem;
  }

  .item:hover .item-hover {
    display: flex;
  }

  p {
    margin: 0;
  }
</style>
