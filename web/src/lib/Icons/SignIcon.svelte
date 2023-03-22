<script lang="ts">
  import type { Type } from "$lang/types/parser/interfaces";
  import Emoji from "$lib/components/Emoji.svelte";
  import { getStringFromType } from "$lib/utils/stringUtil";
  export let signType: Type;
  export let signieIcon: string;
</script>

<div class="sign-icon">
  <div class="emoji-container">
    <Emoji content="pen" />
    <span class="signie-emoji">
      <Emoji content={signieIcon} />
    </span>
  </div>
  <p>{getStringFromType(signType)}</p>
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
  .sign-icon :global(.emoji) {
    font-size: 2rem;
  }
</style>
