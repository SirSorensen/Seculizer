<script lang="ts">
  import SignIcon from "./Icons/SignIcon.svelte";
  import EncryptIcon from "./Icons/EncryptIcon.svelte";
  import Item from "./Item.svelte";

  export let signie: { name: string; emoji: string } | null = null;
  export let encryptKey: { id: string; emoji: string } | null = null;
</script>

<div class="message">
  <Item id="test" emoji="oma-key" />
  {#if signie !== null}
    <SignIcon {signie} />
  {/if}
  {#if encryptKey !== null}
    <EncryptIcon {encryptKey} />
  {/if}
</div>

<style>
  .message {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: #fff3d3;
    width: fit-content;
    padding: 0rem 2rem;
    margin: 0.5rem auto;
    font-size: 1.2rem;
    border-radius: 15px;
    margin-bottom: 2rem;
  }
</style>
