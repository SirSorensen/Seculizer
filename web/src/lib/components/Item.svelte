<script lang="ts">
  import type { Type } from "$lang/types/parser/interfaces";
  import Emoji from "./Emoji.svelte";
  import Format from "./Formats/Format.svelte";
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

<div class="item" bind:this={item} on:mousemove={handleMouse}>
  <Emoji content={emoji} />
  <Format input={value} />
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
    background-color: var(--message-bg);
    text-align: center;
    box-shadow: var(--shadow);
    padding: 0.5rem;
    z-index: 10;
    font-size: 1rem;
  }

  .item:hover .item-hover {
    display: block;
  }
  .item .item-hover:empty {
    display: none;
  }

</style>
