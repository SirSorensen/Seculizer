<script lang="ts">
  import type { Id, StmtComment } from "$lang/types/parser/interfaces";
  import { calcPositions } from "$lib/utils/PositionUtil";
  import type { VisualKnowledge } from "src/types/participant";
  import Participant from "./Participant.svelte";
  export let participants: {
    Name: Id;
    Emoji: string;
    Comment?: StmtComment
    Knowledge: VisualKnowledge[];
  }[] = [];

  let container: HTMLElement;
  let containerWidth: number;
  let containerHeight: number;
  let positions: { x: number; y: number }[] = [];
  $: {
    if (container) positions = calcPositions(participants.length, container);
  }
  export let participantElements: { [key: string]: HTMLElement } = {};
  
</script>

<div class="container" bind:this={container} bind:offsetWidth={containerWidth} bind:offsetHeight={containerHeight}>
  {#if positions.length > 0}
    {#each participants as parti, index}
      <Participant
        bind:element={participantElements[parti.Name.value]}
        pos={{ left: positions[index].x, top: positions[index].y }}
        name={parti.Name}
        comment={parti.Comment}
        emoji={parti.Emoji}
        knowledge={parti.Knowledge}
      />
    {/each}
  {/if}
</div>

<style>
  div.container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-start;
    height: 100%;
    position: relative;
  }
</style>
