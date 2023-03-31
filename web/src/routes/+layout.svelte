<script lang="ts">
  import Header from "$lib/components/Header.svelte";
</script>

<div id="main">
  <Header />
  <slot />
</div>

<style>
  #main {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100vh;
  }
  :global(button) {
    padding: 0.5rem;
    border: none;
    background: #fff3d3;
    border-radius: 0.5rem;
    cursor: pointer;
    margin: 1rem auto;
    padding: 1rem 1.5rem;
    display: block;
    font-weight: bold;
  }

  :global(button:disabled) {
    background: #f6f6f6;
  }

  :global(button:hover:not(:disabled)) {
    background: #f3e7c7;
  }
</style>
