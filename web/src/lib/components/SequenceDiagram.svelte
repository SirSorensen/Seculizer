<script lang="ts">
  import mermaid from "mermaid";
  import { onMount } from "svelte";
  import type { Frame } from "$lib/models/Frame";

  export let frame: Frame;
  let graph: HTMLElement;
  let content = "";
  let isInitialized = false;
  function getContent() {
    content = "sequenceDiagram\n";
    frame
      .getParticipantMap()
      .getParticipantsNames()
      .forEach((name) => {
        if (name === "Shared") return;
        content += `participant ${name}\n`;
      });
    frame.getHistory().forEach((event) => {
      if (event.mermaid.trim() !== "") content += event.mermaid + "\n";
    });
  }
  onMount(async () => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "neutral",
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
      },
    });
    getContent();
    const { svg } = await mermaid.render("graphDiv", content);
    graph.innerHTML = svg;
    isInitialized = true;
  });

  function rerender() {
    {
      if (isInitialized) {
        getContent();

        mermaid.render("graphDiv", content).then(({ svg }) => {
          graph.innerHTML = svg;
        });
      }
    }
  }

  $: frame && frame.getHistory() && rerender();
</script>

{#if content.trim() !== ""}
  <pre bind:this={graph} />
{/if}

<style>
  pre {
    max-height: 100%;
    max-height: calc(100% - 75px);
    overflow-y: auto;
    margin: 1rem;
    background: white;
    box-shadow: 0 0 4px rgb(0 0 0 / 25%);
    padding: 1rem;
  }
  pre :global(#graphDiv .actor) {
    stroke: #ccccff;
    fill: #fff3d3;
  }
  pre :global(#graphDiv text.actor) {
    font-weight: bold !important;
  }

  pre :global(#graphDiv .note){
    stroke: #ccccff;
    fill: #ffcc30;
  }

  pre :global(#graphDiv .noteText), pre :global(#graphDiv .noteText>tspan){
    fill: black;
  }
</style>
