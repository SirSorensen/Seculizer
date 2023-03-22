<script lang="ts">
  import type { Type } from "$lang/types/parser/interfaces";
    import Emoji from "$lib/components/Emoji.svelte";
  import { getStringFromType } from "$lib/utils/stringUtil";
  export let encryptType: Type;
</script>

<div class="encrypt-icon">
  <Emoji content="locked" />
  <div class="id-container">
    <p>{getStringFromType(encryptType)}</p>
  </div>
</div>

<style>
  .encrypt-icon {
    position: absolute;
    bottom: 0;
    right: 0;
    transform: translate(20%, 50%);
  }
  .id-container {
    position: relative;
  }
  .id-container p {
    text-align: center;
    font-size: 0.9rem;
    margin: 0;
  }
  .encrypt-icon :global(.emoji) {
    font-size: 2rem;
    margin: 0;
    text-align: center;
  }
</style>
