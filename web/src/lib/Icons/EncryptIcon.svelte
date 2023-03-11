<script lang="ts">
  import type { Expression as ExpressionAST} from "$lang/types/parser/interfaces";
  import type { Program } from "$lib/program";
  import ExpressionBox from "$lib/components/messages/ExpressionBox.svelte";
  export let program: Program;
  export let encryptExpression: ExpressionAST;
</script>

<div class="encrypt-icon">
  <i class="oma oma-locked emoji" />
  <div class="id-container">
    <ExpressionBox program={program} expression={encryptExpression} />
  </div>
</div>

<style>
  .encrypt-icon {
    position: absolute;
    bottom: 0;
    right: 0;
    transform: translate(50%, 70%);
  }
  .id-container {
    position: relative;
  }
  .emoji {
    font-size: 2rem;
  }
</style>
