<script lang="ts">
    import type { StmtComment } from "$lang/types/parser/interfaces";
    import Tex from "./Formats/Tex.svelte";

    export let comment: StmtComment;
</script>
{#if comment.value.type === "string"}
  {comment.value.value}
{:else if comment.value.type === "Tex"}
  <Tex input={comment.value.value} />
{/if}
