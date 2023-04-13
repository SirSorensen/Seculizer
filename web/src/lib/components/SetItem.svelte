<script lang="ts">
  import type { StmtComment, Type } from "$lang/types/parser/interfaces";

  import { getStringFromType } from "$lib/utils/stringUtil";
  import { fade } from "svelte/transition";
  import Emoji from "./Emoji.svelte";
  import Latex from "./Latex.svelte";
  import { program } from "$lib/stores/programStore.js";
  import Comment from "./Comment.svelte";
  export let emoji: string;
  export let value: Type;
  export let newValue: Type;
  export let comment: StmtComment | undefined;
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
  {#if comment}
    <div class="item-hover" style:left={hoverValues.left} style:top={hoverValues.top}>
      <Comment {comment} />
    </div>
  {/if}
</div>

<style>
  .item :global(.emoji) {
    font-size: 3rem;
  }

  .item {
    padding: 1rem;
    text-align: center;
    position: relative;
  }
  .item .item-hover {
    position: absolute;
    top: 100%;
    left: 0;
    display: none;
    width: content;
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
