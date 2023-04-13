<script lang="ts">
  import ExpressionBox from "./ExpressionBox.svelte";
  import type { Expression as ExpressionAST, Id} from "$lang/types/parser/interfaces";
  export let messageExpressions:ExpressionAST[];
  export let participants:{from:Id, to:Id};
</script>

<div class="message">
  {#each messageExpressions as messageExpression}
      <ExpressionBox expression={messageExpression} {participants} />
  {/each}
</div>

<style>
  .message {
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
  .message:has(.sign-icon), .message:has(.encrypt-icon){
    margin-bottom: 2rem;
  }

  .message :global(.message){
    border: 1px dashed black;;
  }
  .message :global(.message p){
    font-size: 1.2rem;
  }
  .message :global(.message .emoji){
    font-size: 1.3rem;
  }
</style>
