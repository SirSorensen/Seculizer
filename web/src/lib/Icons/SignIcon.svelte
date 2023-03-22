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
  <p class="signie">{getStringFromType(signType)}</p>
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
  .emoji-container .signie-emoji :global(.emoji) {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 1.3rem;
  }
  .signie{
    text-align: center;
    font-size: 0.9rem;
    margin: 0;
  }
  .sign-icon :global(.emoji) {
    font-size: 2rem;
    margin: 0;
    text-align: center;
  }
</style>
