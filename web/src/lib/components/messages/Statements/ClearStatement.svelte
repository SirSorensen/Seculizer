<script lang="ts">
  import type { ClearStatement } from "$lang/types/parser/interfaces";
  import Item from "$lib/components/Item.svelte";

  import ActionBox from "../ActionBox.svelte";

  import { program } from "$lib/stores/programStore.js";
  import { onMount } from "svelte";
  export let stmnt: ClearStatement;

  const id = stmnt.id;
  const icon = $program.getIcon(id.value);
  let top = "10%";

  onMount(() => {
    const commonKnowledge = document.getElementById("commonKnowledgeContainer");
    if (!commonKnowledge) return;
    top = commonKnowledge.offsetTop + commonKnowledge.offsetHeight + 10 + "px";
  });
</script>

<div class="statement" style:top>
  <ActionBox title="clear"><Item emoji={icon} value={id} /></ActionBox>
</div>

<style>
  .statement {
    position: absolute;
    left: 50%;
    top: 10%;
    transform: translateX(-50%);
    z-index: 100;
  }

  .statement :global(.message) {
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
  }
</style>
