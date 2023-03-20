<script lang="ts">
  import type { Expression as ExpressionAST } from "$lang/types/parser/interfaces";
  import type { Program } from "$lib/program";
  import { getStringFromType } from "$lib/utils/stringUtil.js";
  import Item from "$lib/components/Item.svelte";
  import EncryptIcon from "$lib/Icons/EncryptIcon.svelte";
  import SignIcon from "$lib/Icons/SignIcon.svelte";

  export let program: Program;
  export let expression: ExpressionAST;
  $: child = expression.child;
</script>

{#if !child}
  <p>Invalid statement</p>
{:else if child.type === "encryptExpression"}
  {@const inner = child.inner}
  {#each inner as innerExpression}
    <svelte:self expression={innerExpression} />
  {/each}
  {@const outer = child.outer}
  <EncryptIcon {program} encryptExpression={outer} />
{:else if child.type === "signExpression"}
  {@const inner = child.inner}
  {#each inner as innerExpression}
    <svelte:self expression={innerExpression} />
  {/each}
  {@const outer = child.outer}
  <SignIcon {program} signExpression={outer} signieIcon={"oma-red-question-mark"}/>
{:else if child.type === "string" || child.type === "number" || child.type === "function"}
  <p>{getStringFromType(child)}</p>
{:else if child.type === "id"}
  <Item id={child.value} emoji={program.icons[child.value]} />
{/if}

<style>
  p {
    margin: 0;
    text-align: center;
    font-size: 1rem;
  }
</style>
