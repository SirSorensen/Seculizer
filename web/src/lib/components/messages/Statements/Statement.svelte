<script lang="ts">
  import type {
    Statement as StatementAST,
    SendStatement as SendStatementAST,
    ClearStatement as ClearStatementAST,
    ParticipantStatement as ParticipantStatementAST,
    StatementNode,
  } from "$lang/types/parser/interfaces";
  import type { NextFrameNavigation } from "src/types/app";
  import ClearStatement from "./ClearStatement.svelte";
  import SendStatement from "./SendStatement.svelte";
  import ParticipantStatement from "./ParticipantStatement.svelte";
  import type { ParticipantElements } from "src/types/participant";
  export let statement: StatementAST;
  export let participantElements: ParticipantElements = { container: undefined, elements: {} };
  export let nextFrame: NextFrameNavigation = () => {};

  const castToSendStatement = (x: StatementNode) => x as SendStatementAST;
  const castToClearStatement = (x: StatementNode) => x as ClearStatementAST;
  const castToParticipantsStatement = (x: StatementNode) => x as ParticipantStatementAST;
</script>

{#if !statement.child}
  <p>Invalid statement</p>
{:else if statement.child.type === "clearStatement"}
  <ClearStatement stmnt={castToClearStatement(statement.child)} />
{:else if statement.child.type === "sendStatement"}
  <SendStatement {participantElements} {nextFrame} stmnt={castToSendStatement(statement.child)} />
{:else if statement.child.type === "participantStatement"}
  <ParticipantStatement {participantElements} stmnt={castToParticipantsStatement(statement.child)} />
{/if}
