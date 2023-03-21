<script lang="ts">
  import { onMount, tick } from "svelte";
  import Participant from "./Participant.svelte";
  export let participants: {
    Name: string;
    Emoji: string;
    Knowledge: { id: string; emoji: string }[];
  }[] = [];

  function calcPositions(amount: number, box: HTMLElement) {
    const boxRect = box.getBoundingClientRect();

    const pos1 = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];
    const pos2 = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];
    const pos3 = [
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
    ];
    const pos4 = [
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
    ];
    const pos5 = [
      [1, 0, 0, 0, 1],
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
    ];
    const pos6 = [
      [0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0],
    ];
    const pos7 = [
      [1, 0, 1, 0, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [0, 1, 0, 1, 0],
    ];
    const pos8 = [
      [0, 1, 0, 1, 0],
      [1, 0, 0, 0, 1],
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [0, 1, 0, 1, 0],
    ];

    let options = [pos1, pos2, pos3, pos4, pos5, pos6, pos7, pos8];
    const pos = options[amount - 1];
    let flat: {
      x: number;
      y: number;
    }[] = pos
      .flatMap((row, y) => {
        let xWidth = boxRect.width / row.length;
        return row.map((col, x) => {
          let yWidth = boxRect.height / pos.length;
          return col ? { x: x * xWidth + xWidth / 2, y: y * yWidth + yWidth / 2 } : null;
        });
      })
      .filter((point): point is { x: number; y: number } => point !== null);
    return flat;
  }
  let container: HTMLElement;
  let containerWidth: number;
  let containerHeight: number;
  let positions: { x: number; y: number }[] = [];
  $: {
    if (container) positions = calcPositions(participants.length, container);
  }
  const participantElements: { [key: string]: Participant } = { };
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
      <div class="participantContainer" style:left={positions[index].x + "px"} style:top={positions[index].y + "px"}>
        <Participant name={parti.Name} emoji={parti.Emoji} knowledge={parti.Knowledge} bind:this={participantElements[parti.Name]}/>
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
  }
</style>
