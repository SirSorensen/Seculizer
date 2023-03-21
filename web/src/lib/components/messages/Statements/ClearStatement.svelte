<script lang="ts">
  import type { ClearStatement, StatementNode } from "$lang/types/parser/interfaces";
  import Item from "$lib/components/Item.svelte";
  import type { Program } from "$lib/program";
  import ActionBox from "../ActionBox.svelte";

  export let program: Program;

  export let stmnt: ClearStatement;

  const id = stmnt.id;
  const icon = program.icons.get(id) || "question-mark";
</script>

<ActionBox title="clear"><Item emoji={icon} id={id.value} /></ActionBox>
