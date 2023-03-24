<script lang="ts">
  import type { ParticipantStatement, ParticipantStatementNode, NewStatement, SetStatement } from "$lang/types/parser/interfaces";
  import type { Program } from "$lib/models/program";
  import ActionBox from "../ActionBox.svelte";
  import { getStringFromType } from "$lib/utils/stringUtil";
  import Item from "$lib/components/Item.svelte";
  import { onMount } from "svelte";

  export let program: Program;

  export let stmnt: ParticipantStatement;
  export let participantElements: ParticipantElements = {
    container: undefined,
    elements: {},
  };
  const child = stmnt.child;
  let statement: HTMLElement;
  function update() {
    let container = participantElements.container;
    let participant = participantElements.elements[stmnt.id.value];

    if (participant) {
      let x = participant.offsetLeft + (container?.offsetLeft || 0);
      let y = participant.offsetTop + (container?.offsetTop || 0) + participant.offsetHeight + 50;
      statement.style.left = x + "px";
      statement.style.top = y + "px";
    }
  }
  onMount(() => {
    let container = participantElements.container;
    if (!container) return;
    const resizeObserver = new ResizeObserver((_) => {
      update();
    });

    resizeObserver.observe(container);
    update();
    // This callback cleans up the observer
    return () => {
      if (container) resizeObserver.unobserve(container);
    };
  });

  const castToNewStatement = (x: ParticipantStatementNode) => x as NewStatement;
  const castToSetStatement = (x: ParticipantStatementNode) => x as SetStatement;
</script>

<div class="statement" bind:this={statement}>
  {#if !child}
    <p>Invalid participant statement</p>
  {:else if child.type === "newStatement"}
    {@const newStmnt = castToNewStatement(child)}
    {@const id = newStmnt.id}
    {@const icon = program.getIcon(id.value)}
    <ActionBox title="new"><Item emoji={icon} value={id.value} /></ActionBox>
  {:else if child.type === "setStatement"}
    {@const setStmnt = castToSetStatement(child)}
    {@const id = setStmnt.id}
    {@const icon = program.getIcon(id.value)}
    {@const value = setStmnt.value}
    <ActionBox title="new"><div><Item emoji={icon} value={id.value + " = " + getStringFromType(value)} /></div></ActionBox>
  {/if}
</div>

<style>
  .statement {
    position: absolute;
    transform: translate(-50%, -50%);
  }
</style>
