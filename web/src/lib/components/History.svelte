<script lang="ts">
  import type { Frame } from "$lib/models/Frame";

  export let frame: Frame;

  let showHistory = false;
  let historyElem: HTMLOListElement;
  $: {
    if (showHistory) {
      historyElem.scrollTop = historyElem.offsetHeight;
    }
  }
</script>

{#if frame.getHistory().length > 0}
  <div class="historyContainer" class:showHistory>
    <ol class="history" bind:this={historyElem}>
      {#each frame.getHistory() as history}
        <li class="history-item">{@html history}</li>
      {/each}
    </ol>
    <button class="historyButton" on:click={() => (showHistory = !showHistory)}><i class="oma oma-hourglass-not-done" /></button>
  </div>
{/if}

<style>
  .historyContainer {
    position: fixed;
    left: 0;
    bottom: 0;
    transform: translate(calc(-100% + 3.5rem), 0);
    display: flex;
    transition: 0.5s transform;
    align-items: end;
    z-index: 6;
    max-width: 100%;
  }

  .historyContainer.showHistory {
    transform: translate(0, 0);
  }
  .history {
    max-height: 35vh;
    overflow-y: auto;
    margin: 1rem;
    display: flex;
    /*flex-direction: column-reverse;*/
    flex-direction: column;
    background: #fff3d3;
    box-shadow: 0 0 4px rgb(0 0 0 / 25%);
    padding: 1rem 2rem;
  }
  .history-item{
    margin: .1rem 0;
  }
  .oma-hourglass-not-done {
    font-size: 1.5rem;
    transition: 0.5s transform;
  }
  .historyButton {
    margin-left: 0.5rem;
    width: 3rem;
    height: 3rem;
    padding: 0;
    border-radius: 3rem;
    box-shadow: 0 0 4px rgb(0 0 0 / 25%);
  }
  .historyContainer.showHistory .historyButton .oma-hourglass-not-done {
    transform: rotate(180deg);
  }
</style>
