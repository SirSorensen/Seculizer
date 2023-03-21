<script lang="ts">
  import type { Statement as StatementAST, SendStatement as SendStatementAST, ClearStatement as ClearStatementAST, ParticipantStatement as ParticipantStatementAST, StatementNode } from "$lang/types/parser/interfaces";
  import type { Program } from "$lib/program";
  import ClearStatement from "./ClearStatement.svelte";
  import SendStatement from "./SendStatement.svelte";
  import ParticipantStatement from "./ParticipantStatement.svelte";
  export let statement: StatementAST;
  export let program: Program;

  
  const castToSendStatement = (x: StatementNode) => x as SendStatementAST;
  const castToClearStatement = (x: StatementNode) => x as ClearStatementAST;
  const castToParticipantsStatement = (x: StatementNode) => x as ParticipantStatementAST;
</script>
{#if !statement.child}
  <p>Invalid statement</p>
{:else if statement.child.type === "clearStatement"}
  <ClearStatement {program} stmnt={castToClearStatement(statement.child)} />
{:else if statement.child.type === "sendStatement"}
  <SendStatement {program} stmnt={castToSendStatement(statement.child)} />
{:else if statement.child.type === "participantStatement"}
  <ParticipantStatement {program} stmnt={castToParticipantsStatement(statement.child)} />
{/if}
