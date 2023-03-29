<script lang="ts">
  import type { Id } from "$lang/types/parser/interfaces";
  import type { Program } from "$lib/models/program";
  import { calcPositions } from "$lib/utils/PositionUtil";
    import type { VisualKnowledge } from "src/types/participant";
  import { onMount, tick } from "svelte";
  import Participant from "./Participant.svelte";
  export let participants: {
    Name: Id;
    Emoji: string;
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
  onMount(() => {
    const resizeObserver = new ResizeObserver((_) => {
      // We're only watching one element
      positions = calcPositions(participants.length, container);
    });

    resizeObserver.observe(container);
    tick().then(() => {
      // We need to do this to make the transform fixed
      const participantsElements = Array.from(document.getElementsByClassName("participantContainer") as HTMLCollectionOf<HTMLElement>);

      for (let i = 0; i < participantsElements.length; i++) {
        const participant = participantsElements[i];
        participant.style.transform = `translate(-${participant.clientHeight / 2}px, -${participant.clientWidth / 2}px)`;
      }
    });

    // This callback cleans up the observer
    return () => resizeObserver.unobserve(container);
  });
</script>

<div class="container" bind:this={container} bind:offsetWidth={containerWidth} bind:offsetHeight={containerHeight}>
  {#if positions.length > 0}
    {#each participants as parti, index}
      <div
        class="participantContainer"
        style:left={positions[index].x + "px"}
        style:top={positions[index].y + "px"}
        bind:this={participantElements[parti.Name.value]}
      >
        <Participant name={parti.Name} emoji={parti.Emoji} knowledge={parti.Knowledge} />
      </div>
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

  div.participantContainer {
    position: absolute;
    z-index: 5;
  }
</style>
