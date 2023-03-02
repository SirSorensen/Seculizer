<script lang="ts">
  import { fade } from "svelte/transition";
  export let emoji: String;
  export let id: String;
</script>

<div transition:fade={{ delay: 250, duration: 300 }} class="item">
  <p class="emoji"><i class="oma {emoji}" /></p>
  <p>{id}</p>
</div>

<style>
  .emoji {
    font-size: 3rem;
  }

  .item {
    padding: 1rem;
    text-align: center;
  }

  p {
    margin: 0;
  }

</style>
