<script lang="ts">
  import type { Id, Type } from "$lang/types/parser/interfaces";
  import { program } from "$lib/stores/programStore";
  import { getStringFromType } from "$lib/utils/stringUtil";
  import type { ParticipantKnowledge, VisualKnowledge } from "src/types/participant";
  import Item from "./Item.svelte";
  import Latex from "./Latex.svelte";
  export let name: Id;
  export let emoji: string;
  export let knowledge: VisualKnowledge[] = [];

  let container: HTMLDivElement;
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
  function flatKnowledgeTypes(knowledges: ParticipantKnowledge[]): { type: Type; value?: Type }[] {
    let flat: { type: Type; value?: Type }[] = [];
    for (const knowledge of knowledges) {
      if (knowledge.type === "encryptedKnowledge") {
        flat.concat(flatKnowledgeTypes(knowledge.knowledge));
      } else {
        flat.push({ type: knowledge.knowledge, value: knowledge.value });
      }
    }
    return flat;
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
    <div class="participant-item">
      <Item value={name} {emoji} />
    </div>
    {#key knowledge.length}
      <div class="knowledges" use:accordion={showKnowledge}>
        {#if knowledge.length === 0}
          <p class="emptyText">Empty</p>
        {:else}
          {#each knowledge as visualKnowledge}
            {#if visualKnowledge.knowledge.type === "encryptedKnowledge"}
              {#each flatKnowledgeTypes(visualKnowledge.knowledge.knowledge) as { type, value }}
                <Item value={type} emoji={visualKnowledge.emoji}>
                  {#if value}
                    <div class="knowledgeValue">
                      {#if $program.getFormats().contains(value)}
                        {@const format = $program.getFormats().getConstructedLatex(value)}
                        <Latex input={format} />
                      {:else}
                        <small>{getStringFromType(value)}</small>
                      {/if}
                    </div>
                    <!--Should this value be available if encrypted?-->
                  {/if}
                </Item>
              {/each}
            {:else}
              {@const value = visualKnowledge.knowledge.value}
              <Item value={visualKnowledge.knowledge.knowledge} emoji={visualKnowledge.emoji}>
                {#if value}
                  <div class="knowledgeValue">
                    {#if $program.getFormats().contains(value)}
                      {@const format = $program.getFormats().getConstructedLatex(value)}
                      <Latex input={format} />
                    {:else}
                      <small>{getStringFromType(value)}</small>
                    {/if}
                  </div>
                  <!--Should this value be available if encrypted?-->
                {/if}
              </Item>
            {/if}
          {/each}
        {/if}
      </div>
    {/key}
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
    width: 125px;
    min-height: 125px;
  }
  .knowledges {
    overflow: hidden;
    transition: all 2s ease-in-out;
  }
  .emptyText {
    font-size: 1rem;
    font-style: italic;
    color: gray;
  }
</style>
