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
  import type { NextFrameNavigation } from "src/types/app";
  import ClearStatement from "./ClearStatement.svelte";
  import SendStatement from "./SendStatement.svelte";
  import ParticipantStatement from "./ParticipantStatement.svelte";
  import type { ParticipantElements } from "src/types/participant";
  import Comment from "$lib/components/Comment.svelte";
  const [send, receive] = crossfade({
		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t};
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
      <Comment comment={statement.comment} />
      <svg width="134" height="142" viewBox="0 0 134 142" fill="none" class="seculizer-icon" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="36" width="79" height="73" fill="white"/>
        <path
          d="M70.7408 0.80872C69.5683 0.278869 68.3121 0 67 0C65.6879 0 64.4317 0.278869 63.2592 0.80872L10.6922 23.0903C4.55053 25.6838 -0.0277896 31.7353 0.000126979 39.0416C0.13971 66.7054 11.5297 117.32 59.63 140.327C64.2921 142.558 69.7079 142.558 74.37 140.327C122.47 117.32 133.86 66.7054 134 39.0416C134.028 31.7353 129.449 25.6838 123.308 23.0903L70.7408 0.80872ZM40.4513 79.8123C41.7913 80.1469 43.215 80.3142 44.6667 80.3142C54.5213 80.3142 62.5333 72.3107 62.5333 62.4666V44.619H74.8725C78.2504 44.619 81.3491 46.5153 82.8566 49.555L84.8666 53.5428H102.733C105.19 53.5428 107.2 55.5507 107.2 58.0047V66.9285C107.2 79.2545 97.2058 89.238 84.8666 89.238H71.4667V103.377C71.4667 105.412 69.8196 107.086 67.7537 107.086C67.2512 107.086 66.7488 106.974 66.3021 106.779L38.7484 94.9827C36.9059 94.2019 35.7334 92.3892 35.7334 90.4093C35.7334 89.6284 35.9009 88.8755 36.2638 88.1783L40.4513 79.8123ZM40.2001 44.619H51.3667H53.6V53.5428V62.4666C53.6 67.4026 49.608 71.3904 44.6667 71.3904C39.7255 71.3904 35.7334 67.4026 35.7334 62.4666V49.0809C35.7334 46.6269 37.7434 44.619 40.2001 44.619ZM75.9333 58.0047C75.9333 56.8213 75.4627 55.6864 74.6251 54.8497C73.7874 54.0129 72.6513 53.5428 71.4667 53.5428C70.282 53.5428 69.1459 54.0129 68.3083 54.8497C67.4706 55.6864 67 56.8213 67 58.0047C67 59.1881 67.4706 60.323 68.3083 61.1597C69.1459 61.9965 70.282 62.4666 71.4667 62.4666C72.6513 62.4666 73.7874 61.9965 74.6251 61.1597C75.4627 60.323 75.9333 59.1881 75.9333 58.0047Z"
        />
      </svg>
        
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
    transform: translate(-50%, 0 );
    background-color: var(--message-bg);
    padding: 1rem 2rem;
    border-radius: 1rem;
  }

  .comment .seculizer-icon {
    height: 1.7rem;
    width: 1.7rem;
    fill: black;
    display: block;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>