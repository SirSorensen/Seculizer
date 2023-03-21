<script lang="ts">
  import type {
    ParticipantStatement,
    StatementNode,
    ParticipantStatementNode,
    NewStatement,
    SetStatement,
  } from "$lang/types/parser/interfaces";
  import type { Program } from "$lib/program";
  import ActionBox from "../ActionBox.svelte";
  import { getStringFromType } from "$lib/utils/stringUtil";
  import Item from "$lib/components/Item.svelte";

  export let program: Program;

  export let stmnt: ParticipantStatement;

  const child = stmnt.child;

  const castToNewStatement = (x: ParticipantStatementNode) => x as NewStatement;
  const castToSetStatement = (x: ParticipantStatementNode) => x as SetStatement;
</script>

{#if !child}
  <p>Invalid participant statement</p>
{:else if child.type === "newStatement"}
  {@const newStmnt = castToNewStatement(child)}
  {@const id = newStmnt.id}
  {@const icon = program.icons.get(id) || "question-mark"}
  <ActionBox title="new"><Item emoji={icon} id={id.value} /></ActionBox>
{:else if child.type === "setStatement"}
  {@const setStmnt = castToSetStatement(child)}
  {@const id = setStmnt.id}
  {@const icon = program.icons.get(id) || "question-mark"}
  {@const value = setStmnt.value}
  <ActionBox title="new"><div><Item emoji={icon} id={id.value} /> = {getStringFromType(value)}</div></ActionBox>
{/if}
