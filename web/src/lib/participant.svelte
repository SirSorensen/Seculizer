<script lang="ts">
  import { fade } from "svelte/transition";

  let container: HTMLDivElement;
  export let name: String;
  export let emoji: String;
  export let knowledge: { Id: String; Emoji: String }[] = [];

  let showKnowledge = false;
  export function accordion(node: HTMLDivElement, showKnowledge: boolean) {
    let initialHeight = node.offsetHeight;
    node.style.height = showKnowledge ? "auto" : "0";
    node.style.overflow = "hidden";
    return {
      update(showKnowledge: boolean) {
        let animation = node.animate(
          [
            {
              height: initialHeight + "px",
              overflow: "hidden",
            },
            {
              height: 0,
              overflow: "hidden",
            },
          ],
          { duration: 500, fill: "both" }
        );
        animation.pause();
        if (!showKnowledge) {
          animation.play();
        } else {
          animation.reverse();
        }
      },
    };
  }

  function nodeContains(event: MouseEvent, container: HTMLDivElement) {
    let node = event.relatedTarget as Node;
    return container.contains(node);
  }
</script>

<div
  class="outerContainer"
  bind:this={container}
  on:focus={() => {
    showKnowledge = true;
  }}
  on:blur={() => {
    showKnowledge = false;
  }}
  on:mouseover={() => {
    showKnowledge = true;
  }}
  on:mouseout={(e) => {
    if (nodeContains(e, container)) return;

    showKnowledge = false;
  }}
>
  <div class="container">
    <div class="elem showKnowledge">
      <p class="emoji">{emoji}</p>
      <p>{name}</p>
    </div>
    <div class="knowledges" use:accordion={showKnowledge}>
      {#each knowledge as { Id, Emoji }}
        <div transition:fade={{ delay: 250, duration: 300 }} class="elem">
          <p class="emoji">{Emoji}</p>
          <p>{Id}</p>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  div.outerContainer {
    width: 100%;
  }
  div.container {
    background-color: #fff3d3;
    align-items: center;
    font-size: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 1000px;
    text-align: center;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
    transition: all 2s ease-in-out;
    max-width: 250px;
  }
  .knowledges {
    overflow: hidden;
    transition: all 2s ease-in-out;
  }

  .emoji {
    font-size: 3rem;
  }

  p {
    margin: 0;
  }

  .elem {
    padding: 1rem;
  }
</style>
