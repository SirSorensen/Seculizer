<script lang="ts">
  import type {
    SendStatement,
    MessageSendStatement,
    SendStatementNode,
    MatchStatement,
  } from "$lang/types/parser/interfaces";
  import type { Program } from "$lib/models/program";
  import MessageBox from "../MessageBox.svelte";
  import { getStringFromType } from "$lib/utils/stringUtil";

  export let program: Program;

  export let stmnt: SendStatement;
  
  const leftId = stmnt.leftId;
  const rightId = stmnt.rightId;
  const child = stmnt.child;

  const castToMessageStatement = (x: SendStatementNode) => x as MessageSendStatement;
  const castToMatchStatement = (x: SendStatementNode) => x as MatchStatement;
</script>
{#if !child}
  <p>Invalid statement</p>
{:else if child.type === "messageSendStatement"}
  {@const messageSendStatement = castToMessageStatement(child)}
  {@const messageSendElements = messageSendStatement.expressions}
  {#each messageSendElements as messageSendElement}
    {@const expression = messageSendElement}
    <MessageBox {program} fromId={leftId.value} toId={rightId.value} messageExpressions={[expression]} />
  {/each}
{:else if child.type === "matchStatement"}
  {@const matchStatement = castToMatchStatement(child)}
  {@const cases = matchStatement.cases}
  {#each cases as matchCase}
    <button>{getStringFromType(matchCase.case)}</button>
  {/each}
{/if}
