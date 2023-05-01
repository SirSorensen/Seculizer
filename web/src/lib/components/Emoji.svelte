<script lang="ts">
  import { getEmoji } from "$lib/utils/EmojiUtil";

  export let content: string = "red-question-mark";
  export let classes = "";
  let omaEmoji: { type: "background"; value: string } | { type: "class"; value: string } = {
    type: "class",
    value: "red-question-mark",
  };

  $: omaEmoji = getEmoji(content);
</script>

<div class="emoji {classes}">
  {#if omaEmoji.type === "class"}
    <i class="oma oma-{omaEmoji.value}" />
  {:else if omaEmoji.type === "background"}
    <i class="oma" style="background-image: url({omaEmoji.value})" />
  {/if}
</div>

