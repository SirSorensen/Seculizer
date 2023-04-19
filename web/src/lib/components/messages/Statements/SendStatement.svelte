<script lang="ts">
  import type { SendStatement, MessageSendStatement, SendStatementNode, MatchStatement } from "$lang/types/parser/interfaces";
  import MessageBox from "../MessageBox.svelte";
  import { getStringFromType } from "$lib/utils/stringUtil";
  import { onMount } from "svelte";
  import type { NextFrameNavigation } from "src/types/app";
  import type { ParticipantElements } from "src/types/participant";

  export let stmnt: SendStatement;
  export let participantElements: ParticipantElements = {
    container: undefined,
    elements: {},
  };
  export let nextFrame: NextFrameNavigation = () => {};
  const fromId = stmnt.leftId;
  const toId = stmnt.rightId;
  const child = stmnt.child;

  const castToMessageStatement = (x: SendStatementNode) => x as MessageSendStatement;
  const castToMatchStatement = (x: SendStatementNode) => x as MatchStatement;
  let from = { left: 0, top: 0, width: 0, height: 0 };
  let to = { left: 0, top: 0, width: 0, height: 0 };
  let sendLine: HTMLElement;
  let message: HTMLElement;
  function update() {
    const fromParticipant = participantElements.elements[fromId.value].getElementsByClassName(
      "participantInnerContainer"
    )[0] as HTMLElement;
    const toParticipant = participantElements.elements[toId.value].getElementsByClassName("participantInnerContainer")[0] as HTMLElement;
    const fromParent = fromParticipant.parentElement;
    const toParent = toParticipant.parentElement;
    if (!fromParent) return;
    if (!toParent) return;
    const container = participantElements.container;
    if (!container) return;
    const containerOffset = { x: container.offsetLeft || 0, y: container.offsetTop || 0 };
    from = {
      left: fromParent.offsetLeft + containerOffset.x - fromParticipant.offsetWidth / 2,
      top: fromParent.offsetTop + containerOffset.y - fromParticipant.offsetHeight / 2,
      width: fromParticipant.offsetWidth,
      height: fromParticipant.offsetWidth,
    };

    to = {
      left: toParent.offsetLeft + containerOffset.x - toParticipant.offsetWidth / 2,
      top: toParent.offsetTop + containerOffset.y - toParticipant.offsetHeight / 2,
      width: toParticipant.offsetWidth,
      height: toParticipant.offsetWidth,
    };
    updateLine();
  }

  function updateLine() {
    let left = from.left + from.width / 2;
    let right = to.left + to.width / 2;
    let length = right - left;
    let height = to.top - from.top;
    let rad = Math.atan2(height, length);

    left = left + (Math.cos(rad) * from.width) / 2;
    length = length - Math.cos(rad) * from.width;

    let middle = from.top + from.height / 2 + (Math.sin(rad) * from.height) / 2;
    height = height - Math.sin(rad) * from.height;
    let c = Math.sqrt(Math.pow(length, 2) + Math.pow(height, 2));
    let shouldFlip = rad > Math.PI / 2 || rad < -Math.PI / 2;

    sendLine.style.setProperty("top", middle + "px");
    sendLine.style.setProperty("left", left + "px");
    sendLine.style.setProperty("width", c + "px");
    sendLine.style.setProperty("transform", `rotate(${rad}rad) ${shouldFlip ? "scaleY(-1)" : ""}`);
    message.style.setProperty("transform", `rotate(${shouldFlip ? rad : -rad}rad) ${shouldFlip ? "scaleY(-1)" : ""}`);
  }

  onMount(() => {
    let container = participantElements.container;
    if (!container) return;
    const resizeObserver = new ResizeObserver((_) => {
      // We're only watching one element
      update();
    });

    resizeObserver.observe(container);
    update();

    // This callback cleans up the observer
    return () => {
      if (container) resizeObserver.unobserve(container);
    };
  });
</script>

<svelte:window on:resize={update} />
<div class="line" bind:this={sendLine}>
  {#if !child}
    <p>Invalid statement</p>
  {:else if child.type === "messageSendStatement"}
    {@const messageSendStatement = castToMessageStatement(child)}
    {@const messageSendElements = messageSendStatement.expressions}
    <div class="message" bind:this={message} class:multiMessage={messageSendElements.length > 1}>
      {#each messageSendElements as messageSendElement}
        {@const expression = messageSendElement}
        <MessageBox messageExpressions={[expression]} participants={{from: fromId, to: toId}}/>
      {/each}
    </div>
  {:else if child.type === "matchStatement"}
    {@const matchStatement = castToMatchStatement(child)}
    {@const cases = matchStatement.cases}
    <div class="message multiMessage" bind:this={message}>
      {#each cases as matchCase}
        {@const identifier = getStringFromType(matchCase.case)}
        <button on:click={() => nextFrame(identifier)}>{identifier}</button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .line {
    width: 5px;
    height: 3px;
    border-radius: 3px;
    background: var(--line-color);
    position: absolute;
    transform-origin: left;
    display: flex;
    justify-content: center;
  }

  .line::after,
  .line::before {
    content: " ";
    display: block;
    position: absolute;
    width: 30px;
    height: 3px;
    border-radius: 3px;
    background-color: var(--line-color);
    right: 0;
    transform: rotate(45deg) translate(3px, -50%);
    transform-origin: right;
  }
  .line::before {
    transform: rotate(-45deg) translate(3px, 50%);
  }
  .message {
    position: absolute;
    margin: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }

  .message.multiMessage {
    padding: 1rem;
    border: 2px dashed var(--multi-message-border);
    border-radius: 15px;
    background-color: var(--multi-message-bg);
  }
</style>
