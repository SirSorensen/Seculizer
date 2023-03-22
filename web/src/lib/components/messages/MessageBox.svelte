<script lang="ts">
  import ExpressionBox from "./ExpressionBox.svelte";
  import type { Expression as ExpressionAST} from "$lang/types/parser/interfaces";
  import type { Program } from "$lib/models/program";

  export let program:Program;
  export let messageExpressions:ExpressionAST[];
</script>

<div class="message">
  {#each messageExpressions as messageExpression}
      <ExpressionBox {program} expression={messageExpression} />
  {/each}
</div>

<style>
  .message {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: #fff3d3;
    width: fit-content;
    padding: 0rem 2rem;
    margin: 0.5rem auto;
    font-size: 1.2rem;
    border-radius: 15px;
    margin-bottom: 2rem;
    min-height: 2rem;
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
