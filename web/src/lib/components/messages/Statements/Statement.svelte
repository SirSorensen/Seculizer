<script lang="ts">
  import type {
    Statement as StatementAST,
    SendStatement as SendStatementAST,
    ClearStatement as ClearStatementAST,
    ParticipantStatement as ParticipantStatementAST,
    StatementNode,
  } from "$lang/types/parser/interfaces";
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
  import type { NextFrameNavigation } from "src/types/app";
  import ClearStatement from "./ClearStatement.svelte";
  import SendStatement from "./SendStatement.svelte";
  import ParticipantStatement from "./ParticipantStatement.svelte";
  import type { ParticipantElements } from "src/types/participant";
  import Latex from "$lib/components/Latex.svelte";
  const [send, receive] = crossfade({
		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});
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
{#if statement.comment && statement.comment !== null}
    <p class="comment" in:receive={{key: statement.comment.value}} out:send={{key: statement.comment.value}}>
      {#if statement.comment.value.type === "string"}
        {statement.comment.value.value}
      {:else if statement.comment.value.type === "latex"}
        <Latex input={statement.comment.value.value} />
      {/if}
    </p>
{/if}

<style>
  .comment {
    font-style: italic;
    font-size: 1em;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>