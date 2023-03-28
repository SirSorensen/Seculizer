<script lang="ts">
  import type { ClearStatement } from "$lang/types/parser/interfaces";
  import Item from "$lib/components/Item.svelte";

  import ActionBox from "../ActionBox.svelte";

  import { program } from "$lib/stores/programStore.js";
  export let stmnt: ClearStatement;

  const id = stmnt.id;
  const icon = $program.getIcon(id.value);
</script>

<div class="statement">
  <ActionBox title="clear"><Item emoji={icon} value={id} /></ActionBox>
</div>

<style>
  .statement {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>
