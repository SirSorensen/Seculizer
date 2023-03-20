<script lang="ts">
  import { fade } from "svelte/transition";
  import Emoji from "./Emoji.svelte";
  export let emoji: string;
  export let id: string;
</script>

<div transition:fade={{ delay: 250, duration: 300 }} class="item">
  <Emoji content={emoji}/>
  <p>{id}</p>
</div>

<style>
  .item :global(.emoji) {
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
