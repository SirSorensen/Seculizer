<script lang="ts">
  import type {
    EncryptExpression,
    Expression as ExpressionAST,
    ExpressionNode,
    Id,
    SignExpression,
    Type,
  } from "$lang/types/parser/interfaces";
  import type { Program } from "$lib/program";
  import { getStringFromType } from "$lib/utils/stringUtil.js";
  import Item from "$lib/components/Item.svelte";
  import EncryptIcon from "$lib/Icons/EncryptIcon.svelte";
  import SignIcon from "$lib/Icons/SignIcon.svelte";

  export let program: Program;
  export let expression: ExpressionAST;
  let child = expression.child;

  const castToEncryptExpression = (x: ExpressionNode) => x as EncryptExpression;
  const castToSignExpression = (x: ExpressionNode) => x as SignExpression;
  const castToType = (x: ExpressionNode) => x as Type;
  const castToId = (x: ExpressionNode) => x as Id;
</script>

{#if !child}
  <p>Invalid statement</p>
{:else if child.type === "encryptExpression"}
  {@const encryptExpression = castToEncryptExpression(child)}
  {@const inner = encryptExpression.inner}
  {#each inner as innerExpression}
    <svelte:self expression={innerExpression} />
  {/each}
  {@const outer = encryptExpression.outer}
  <EncryptIcon encryptType={outer} />
{:else if child.type === "signExpression"}
  {@const signExpression = castToSignExpression(child)}
  {@const inner = signExpression.inner}
  {#each inner as innerExpression}
    <svelte:self expression={innerExpression} />
  {/each}
  {@const outer = signExpression.outer}
  <SignIcon signType={outer} signieIcon={"red-question-mark"} />
{:else if child.type === "string" || child.type === "number" || child.type === "function"}
  {@const type = castToType(child)}
  <p>{getStringFromType(type)}</p>
{:else if child.type === "id"}
  {@const id = castToId(child)}
  <Item id={id.value} emoji={program.icons.get(id) || "red-question-mark"} />
{/if}

<style>
  p {
    margin: 0;
    text-align: center;
    font-size: 1rem;
  }
</style>
