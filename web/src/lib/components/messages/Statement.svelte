<script lang="ts">
  import ActionBox from "./ActionBox.svelte";
  import MessageBox from "./MessageBox.svelte";
  import Item from "../Item.svelte";
  import type { Statement as StatementAST } from "$lang/types/parser/interfaces";
  import type { Program } from "$lib/program";
  export let statement: StatementAST;
  export let program: Program;
</script>

{#if !statement.child}
  <p>Invalid statement</p>
{:else if statement.child.type === "clearStatement"}
  {@const id = statement.child.id.value}
  {@const icon = program.icons[id]}
  <ActionBox title="clear"><Item emoji={icon} {id} /></ActionBox>
{:else if statement.child.type === "sendStatement"}
  {@const leftId = statement.child.leftId.value}
  {@const rightId = statement.child.rightId.value}
  {@const child = statement.child.child}
  {#if !child}
    <p>Invalid statement</p>
  {:else if child.type === "messageSendStatement"}
    {@const messageSendElements = child.ids}
    {#each messageSendElements as messageSendElement}
      {@const expression = messageSendElement.expression}
      {@const alias = messageSendElement.alias?.value}
      <MessageBox
        {program}
        fromId={leftId}
        toId={rightId}
        messageExpressions={[expression]}
        {alias}
      />
    {/each}
  {/if}
{/if}
