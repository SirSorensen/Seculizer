<script lang="ts">
  import type { Expression as ExpressionAST } from "$lang/types/parser/interfaces";
  import type { Program } from "$lib/program";
  import ExpressionBox from "$lib/components/messages/ExpressionBox.svelte";
  export let program: Program;
  export let signExpression: ExpressionAST;
  export let signieIcon: string;
</script>

<div class="sign-icon">
  <div class="emoji-container">
    <i class="oma oma-pen emoji" />
    <i class="oma {signieIcon} signie-emoji" />
  </div>
  <ExpressionBox program={program} expression={signExpression} />
</div>

<style>
  .sign-icon {
    position: absolute;
    bottom: 0;
    left: 0;
    transform: translate(-40%, 60%);
  }
  .emoji-container {
    position: relative;
  }
  .emoji-container .signie-emoji {
    position: absolute;
    bottom: 0;
    right: 0;
  }
  .emoji {
    font-size: 2rem;
  }
  /*p {
    margin: 0;
    text-align: center;
    font-size: 1rem;
  }*/
</style>
