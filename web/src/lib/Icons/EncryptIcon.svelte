<script lang="ts">
  import type { Type } from "$lang/types/parser/interfaces";
  import { getStringFromType } from "$lib/utils/stringUtil";
  export let encryptType: Type;
</script>

<div class="encrypt-icon">
  <i class="oma oma-locked emoji" />
  <div class="id-container">
    <p>{getStringFromType(encryptType)}</p>
  </div>
</div>

<style>
  .encrypt-icon {
    position: absolute;
    bottom: 0;
    right: 0;
    transform: translate(50%, 70%);
  }
  .id-container {
    position: relative;
  }
  .emoji {
    font-size: 2rem;
  }
</style>
