<script lang="ts">
    import type { Program } from "$lib/models/program";
    import type { KnowledgeList } from "src/types/participant";
  import Item from "./Item.svelte";

  export let knowledges:KnowledgeList = [];
  export let program: Program;
</script>

<div class="container">
  <p class="header">Common knowledge</p>
  <div class="knowledges">
    {#if knowledges.length === 0}
      <p class="emptyText">Empty</p>
    {:else}
      {#each knowledges as knowledge}
        <Item {program} value={knowledge.id} emoji={knowledge.emoji} />
      {/each}
    {/if}
  </div>
</div>

<style>
  .container {
    background: #fff3d3;
    width: fit-content;
    padding: 1rem 1.5rem;
    margin: 0.5rem auto;
    box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.25);
    font-size: 1.2rem;
    border-radius: 15px;
  }

  .knowledges {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: start;
  }

  .header {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    margin-bottom: 0.5rem;
    padding: 0;
    text-align: center;
  }
  p.emptyText{
    margin: 0;
    font-size: .8rem;
    font-style: italic;
    color: gray;
  }
</style>
