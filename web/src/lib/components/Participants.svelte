<script lang="ts">
  import Participant from "./Participant.svelte";
  export let participants: {
    Name: string;
    Emoji: string;
    Knowledge: { id: string; emoji: string }[];
  }[] = [];

  function calcPositions(margin: number, amount: number, box: HTMLElement) {
    const boxRect = box.getBoundingClientRect();

    let xMargin = boxRect.width * margin;
    let yMargin = boxRect.height * margin;
    console.log("xMargin", xMargin);
    console.log("yMargin", yMargin);
    console.log("boxRect", boxRect);

    let xMid = boxRect.left + box.offsetWidth / 2;
    let xHalfMid = boxRect.left + xMargin + (box.offsetWidth - xMargin) / 4;
    let x3HalfMid =
      boxRect.left + xMargin + 3 * ((box.offsetWidth - xMargin) / 4);
    let yMid = boxRect.top + box.offsetHeight / 2;
    let yHalfMid = boxRect.top + yMargin + (box.offsetHeight - yMargin) / 4;
    let y3HalfMid =
      boxRect.top + yMargin + 3 * ((box.offsetHeight - yMargin) / 4);

    let pos1 = { x: boxRect.left + xMargin, y: yMid };
    let pos2 = { x: xHalfMid, y: yHalfMid };
    let pos3 = { x: xMid, y: boxRect.top + yMargin };
    let pos4 = { x: x3HalfMid, y: yHalfMid };

    let pos5 = { x: boxRect.right - xMargin, y: yMid };
    let pos6 = { x: x3HalfMid, y: y3HalfMid };
    let pos7 = { x: xMid, y: boxRect.bottom - yMargin };
    let pos8 = { x: xHalfMid, y: y3HalfMid };
    console.log("boxRect", box.offsetHeight, box.offsetTop);

    let options = [
      [pos1, pos5],
      [pos2, pos4, pos7],
      [pos2, pos4, pos6, pos8],
      [pos2, pos3, pos4, pos6, pos8],
      [pos2, pos3, pos4, pos6, pos7, pos8],
      [pos1, pos2, pos3, pos4, pos5, pos6, pos8],
      [pos1, pos2, pos3, pos4, pos5, pos6, pos7, pos8],
    ];

    return options[amount - 2] || [];
  }
  let container: HTMLElement;
  let positions: { x: number; y: number }[] = [];
  $: {
    if (container)
      positions = calcPositions(0.1, 3, container);
  }
</script>

<div class="container" bind:this={container}>
  {#if positions.length > 0}
    {#each positions as pos}
      <div class="test" style:left={pos.x + "px"} style:top={pos.y + "px"}>
        X:{pos.x}
        Y:{pos.y}
      </div>
    {/each}
    {#each participants as parti, index}
      <div
        class="participantContainer"
        style:left={positions[index].x + "px"}
        style:top={positions[index].y + "px"}
      >
        <Participant
          name={parti.Name}
          emoji={parti.Emoji}
          knowledge={parti.Knowledge}
        />
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
    background-color: rgb(255, 218, 218);
  }

  div.participantContainer {
    position: absolute;
    background-color: aliceblue;

    transform: translate(-100%)
  }

  .test {
    position: absolute;
    background-color: red;
    z-index: 10000;
    transform: translate(-100%)
  }
</style>
