<script lang="ts">
  import type { ClearStatement, StatementNode } from "$lang/types/parser/interfaces";
  import Item from "$lib/components/Item.svelte";
  import type { Program } from "$lib/models/program";
  import ActionBox from "../ActionBox.svelte";

  export let program: Program;

  export let stmnt: ClearStatement;

  const id = stmnt.id;
  const icon = program.getIcon(id.value);
</script>

<div class="statement">
  <ActionBox title="clear"><Item emoji={icon} id={id.value} /></ActionBox>
</div>

<style>
  .statement {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

  }
</style>