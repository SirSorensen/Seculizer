<script lang="ts">
    import type { StmtComment } from "$lang/types/parser/interfaces";
    import Latex from "./Formats/Latex.svelte";

    export let comment: StmtComment;
</script>
{#if comment.value.type === "string"}
  {comment.value.value}
{:else if comment.value.type === "latex"}
  <Latex input={comment.value.value} />
{/if}
