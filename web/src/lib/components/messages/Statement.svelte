<script lang="ts">
  import ActionBox from "./ActionBox.svelte";
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
  <ActionBox title="clear"><Item emoji={icon} id={id}></Item></ActionBox>
{:else if statement.child.type === "sendStatement"}
  <p>Send</p>
{/if}
