<script lang="ts">
  import type { SendStatement, MessageSendStatement, SendStatementNode, MatchStatement } from "$lang/types/parser/interfaces";
  import type { Program } from "$lib/models/program";
  import MessageBox from "../MessageBox.svelte";
  import { getStringFromType } from "$lib/utils/stringUtil";
  import { onMount } from "svelte";

  export let program: Program;
  export let stmnt: SendStatement;
  export let participantElements: { container: HTMLElement | undefined; elements: { [key: string]: HTMLElement } } = {
    container: undefined,
    elements: {},
  };
  const fromId = stmnt.leftId;
  const toId = stmnt.rightId;
  const child = stmnt.child;

  const castToMessageStatement = (x: SendStatementNode) => x as MessageSendStatement;
  const castToMatchStatement = (x: SendStatementNode) => x as MatchStatement;
  let from = { left: 0, top: 0, width: 0, height: 0 };
  let to = { left: 0, top: 0, width: 0, height: 0 };
  let sendLine: HTMLElement;
  let message: HTMLElement;
  function update(){
    const fromParticipant = participantElements.elements[fromId.value];
    const toParticipant = participantElements.elements[toId.value];

    const containerOffset = { x: participantElements.container?.offsetLeft || 0, y: participantElements.container?.offsetTop || 0 };

    from = {
      left: fromParticipant.offsetLeft + containerOffset.x - fromParticipant.offsetWidth / 2,
      top: fromParticipant.offsetTop + containerOffset.y - fromParticipant.offsetHeight / 2,
      width: fromParticipant.offsetWidth,
      height: fromParticipant.offsetHeight,
    };

    to = {
      left: toParticipant.offsetLeft + containerOffset.x - toParticipant.offsetWidth / 2,
      top: toParticipant.offsetTop + containerOffset.y - toParticipant.offsetHeight / 2,
      width: toParticipant.offsetWidth,
      height: toParticipant.offsetHeight,
    };
    updateLine();
    updateMessage();
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

    sendLine.style.setProperty("top", middle + "px");
    sendLine.style.setProperty("left", left + "px");
    sendLine.style.setProperty("width", c + "px");
    sendLine.style.setProperty("transform", "rotate(" + rad + "rad) ");
  }

  function updateMessage() {
    let top = 0;
    if (from.top > to.top) {
      top = from.top + from.height / 2;
    } else {
      top = to.top + to.height / 2;
    }

    top = top - Math.abs((from.top - to.top) / 2) + 50;

    let left = from.left+ from.width / 2;
    let right = to.left + to.width / 2;
    let width = Math.abs(right - left);

    message.style.setProperty("top", top + "px");
    if (left < right) {
      message.style.setProperty("left", left + width / 2 - message.offsetWidth / 2 + "px");
    } else {
      message.style.setProperty("left", right + width / 2 - message.offsetWidth / 2 + "px");
    }
  }

  function checkWithin(element1: HTMLElement, element2: HTMLElement): boolean {
    const element1Rect = element1.getBoundingClientRect();
    const element2Rect = element2.getBoundingClientRect();

    const xOverlap = Math.min(element1Rect.right, element2Rect.right) - Math.max(element1Rect.left, element2Rect.left);

    const yOverlap = Math.min(element1Rect.bottom, element2Rect.bottom) - Math.max(element1Rect.top, element2Rect.top);

    return xOverlap > 0 && yOverlap > 0;
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
{#if !child}
  <p>Invalid statement</p>
{:else if child.type === "messageSendStatement"}
  {@const messageSendStatement = castToMessageStatement(child)}
  {@const messageSendElements = messageSendStatement.expressions}
  <div class="line" bind:this={sendLine} />
  <div class="message" bind:this={message} class:multiMessage={messageSendElements.length > 1}>
    {#each messageSendElements as messageSendElement}
      {@const expression = messageSendElement}
      <MessageBox {program} messageExpressions={[expression]} />
    {/each}
  </div>
{:else if child.type === "matchStatement"}
  {@const matchStatement = castToMatchStatement(child)}
  {@const cases = matchStatement.cases}
  {#each cases as matchCase}
    <button>{getStringFromType(matchCase.case)}</button>
  {/each}
{/if}

<style>
  .line {
    width: 5px;
    height: 3px;
    border-radius: 3px;
    background: black;
    position: absolute;
    transform-origin: left;
  }

  .line::after,
  .line::before {
    content: " ";
    display: block;
    position: absolute;
    width: 30px;
    height: 3px;
    border-radius: 3px;
    background-color: black;
    right: 0;
    transform: rotate(45deg) translate(3px, -50%);
    transform-origin: right;
  }
  .line::before {
    transform: rotate(-45deg) translate(3px, 50%);
  }
  .message {
    margin: auto;
    padding: 1rem 1rem;
    position: absolute;
  }

  .message.multiMessage {
    border: 2px dashed gray;
    border-radius: 15px;
    background-color: rgba(255, 255, 255, 0.699);
  }
</style>
