<script lang="ts">
  import ExpressionBox from "./ExpressionBox.svelte";
  import type { Expression as ExpressionAST, Id} from "$lang/types/parser/interfaces";
  export let messageExpressions:ExpressionAST[];
  export let participants:{from:Id, to:Id};
  export let isSubmessage = false;
</script>

<div class="message" class:subMessage={isSubmessage}>
  {#each messageExpressions as messageExpression}
      <ExpressionBox expression={messageExpression} {participants} />
  {/each}
</div>

<style>
  .message, .message :global(.subMessage) {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    background: #fff3d3;
    width: fit-content;
    padding: 0rem 2rem;
    font-size: 1.2rem;
    border-radius: 15px;
    min-height: 2rem;
    max-width: 15rem;
  }
  .message:has(.sign-icon), .message:has(.encrypt-icon) {
    margin-bottom: 2rem;
  }
  .message :global(.subMessage):has(.sign-icon), .message :global(.subMessage):has(.encrypt-icon) {
    margin-bottom: 1.9rem;
  }

  .message :global(.subMessage){
    border: 1px dashed black;;
  }
</style>
