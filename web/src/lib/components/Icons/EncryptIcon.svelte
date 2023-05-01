<script lang="ts">
  import type { StmtComment, Type } from "$lang/types/parser/interfaces";
  import Emoji from "$lib/components/Emoji.svelte";
  import Comment from "$lib/components/Comment.svelte";
  import Format from "../Formats/Format.svelte";
  export let encryptType: Type;
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

<div class="encrypt-icon" bind:this={item} on:mousemove={handleMouse}>
  <Emoji content="locked" />
  <div class="id-container">
    <p>
      <Format input={encryptType} />
    </p>
  </div>
  {#if comment}
    <div class="item-hover" style:left={hoverValues.left} style:top={hoverValues.top}>
      <Comment {comment} />
    </div>
  {/if}
</div>

<style>
  .encrypt-icon {
    position: absolute;
    bottom: 0;
    right: 0;
    transform: translate(40%, 50%);
  }
  .id-container {
    position: relative;
  }
  .id-container p {
    text-align: center;
    font-size: 0.9rem;
    margin: 0;
  }
  .encrypt-icon :global(.emoji) {
    font-size: 2rem;
    height: 2.1rem;
    margin: 0;
    text-align: center;
  }

  .encrypt-icon .item-hover {
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

  .encrypt-icon:hover .item-hover {
    display: flex;
  }
</style>
