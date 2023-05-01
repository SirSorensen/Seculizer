<script lang="ts">
  import type { Type } from "$lang/types/parser/interfaces";
  import type { ParticipantKnowledge, VisualKnowledge } from "src/types/participant";
  import Item from "./Item.svelte";
  import Comment from "./Comment.svelte";

  export let knowledges: VisualKnowledge[] = [];

  function flatKnowledgeTypes(knowledges: ParticipantKnowledge[]): Type[] {
    let flat: Type[] = [];
    for (const knowledge of knowledges) {
      if (knowledge.type === "encryptedKnowledge") {
        flat.concat(flatKnowledgeTypes(knowledge.knowledge));
      } else {
        flat.push(knowledge.knowledge);
      }
    }
    return flat;
  }
</script>

<div class="container" id="commonKnowledgeContainer">
  <p class="header">Common knowledge</p>
  <div class="knowledges">
    {#if knowledges.length === 0}
      <p class="emptyText">Empty</p>
    {:else}
      {#each knowledges as visualKnowledge}
        {#if visualKnowledge.knowledge.type === "encryptedKnowledge"}
          {#each flatKnowledgeTypes(visualKnowledge.knowledge.knowledge) as encryptedKnowledgeType}
            <Item value={encryptedKnowledgeType} emoji={visualKnowledge.emoji} />
          {/each}
        {:else}
          <Item value={visualKnowledge.knowledge.knowledge} emoji={visualKnowledge.emoji}>
            <svelte:fragment slot="hover">
              {#if visualKnowledge.knowledge.comment}
                <Comment comment={visualKnowledge.knowledge.comment} />
              {/if}
            </svelte:fragment>
          </Item>
        {/if}
      {/each}
    {/if}
  </div>
</div>

<style>
  .container {
    background: var(--message-bg);
    width: fit-content;
    padding: 1rem 1.5rem;
    margin: 0.5rem auto;
    box-shadow: inset var(--shadow);
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
  p.emptyText {
    margin: 0;
    font-size: 0.8rem;
    font-style: italic;
    color: var(--knowledge-empty-color);
  }
</style>
