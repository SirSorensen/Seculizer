<script lang="ts">
    import type { Type } from "$lang/types/parser/interfaces";
    import { program } from "$lib/stores/programStore.js";
    import { getStringFromType } from "$lib/utils/stringUtil";
    import Latex from "./Latex.svelte";
    export let input: Type;
</script>

{#if $program.getFormats().contains(input)}
  {@const format = $program.getFormats().getConstructedLatex(input)}
  {#if format.startsWith("$") && format.endsWith("$")}
    <Latex input={format} />
  {:else}
    {format}
  {/if}
{:else}
  {getStringFromType(input)}
{/if}
