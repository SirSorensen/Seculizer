<script lang="ts">
  import SequenceDiagram from "./SequenceDiagram.svelte";
  import { currentFrame } from "$lib/stores/programStore.js";

  type state = "history" | "sequenceDiagram";
  let historyState: { state: state; open: boolean } = { state: "history", open: false };
  let historyElem: HTMLOListElement;
  $: {
    if (historyState.open && historyElem) {
      historyElem.scrollTop = historyElem.offsetHeight;
    }
  }

  function toggleHistory() {
    if (historyState.state === "sequenceDiagram") {
      historyState = {
        state: "history",
        open: true,
      };
      return;
    }
    historyState = {
      state: "history",
      open: !historyState.open,
    };
  }

  function toggleSequenceDiagram() {
    if (historyState.state === "history") {
      historyState = {
        state: "sequenceDiagram",
        open: true,
      };
      return;
    }
    historyState = {
      state: "sequenceDiagram",
      open: !historyState.open,
    };
  }
</script>

<div class="historyContainer" class:open={historyState.open}>
  <div class="option" class:open={historyState.state === "history"}>
    <ol class="history" bind:this={historyElem}>
      {#if $currentFrame && $currentFrame.getHistory().length > 0}
        {#each $currentFrame.getHistory() as history}
          <li class="history-item">{@html history.string}</li>
        {/each}
      {:else}
        <p class="history-item">No history yet</p>
      {/if}
    </ol>
  </div>
  <div class="option" class:open={historyState.state === "sequenceDiagram"}>
      <SequenceDiagram/>
  </div>
  <div class="buttonContainer">
    <button class="roundButton" on:click={toggleSequenceDiagram}><i class="oma oma-people-dialogue" /></button>
    <button class="roundButton" on:click={toggleHistory}><i class="oma oma-hourglass-not-done" /></button>
  </div>
</div>

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

  .historyContainer.open {
    transform: translate(0, 0);
  }
  .history {
    max-height: 35vh;
    overflow-y: auto;
    margin: 1rem;
    display: flex;
    flex-direction: column;
    background: var(--message-bg);
    box-shadow: var(--shadow);
    padding: 1rem 2rem;
  }
  .option {
    display: none;
  }
  .option.open {
    display: block;
  }

  .history-item {
    margin: 0.1rem 0;
  }
  .oma {
    font-size: 2rem;
    transition: 0.5s transform;
  }
  .roundButton {
    margin-left: 0.5rem;
    width: 3rem;
    height: 3rem;
    padding: 0;
    border-radius: 6rem;
    box-shadow: var(--shadow);
  }
  .historyContainer.showHistory .roundButton .oma-hourglass-not-done {
    transform: rotate(180deg);
  }
</style>
