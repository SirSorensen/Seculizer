<script lang="ts">
  import Header from "$lib/components/Header.svelte";
</script>
<svelte:head>
  <title>Seculizer</title>
</svelte:head>
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


    --line-color: black;
    --multi-message-bg: rgba(255, 255, 255, 0.69);
    --multi-message-border: gray;
    --message-bg: #fff3d3;
    --sub-message-border-color: #d7b765;
    --sub-message-border: .15rem solid var(--sub-message-border-color);
    --action-header-bg: #ffcc30;

    --shadow: 0 0 4px rgba(0, 0, 0, 0.25);
    --button-bg: #fff3d3;
    --button-bg-disabled: #f6f6f6;
    --button-bg-hover: #f3e7c7;
    --button-color: inherit;
    --button-color-disabled: inherit;
    --button-color-hover: inherit;

    --sequence-bg: white;
    --sequence-actor-stroke: #ccccff;
    --sequence-note-stroke: #ccccff;
    --sequence-text: black;

    --knowledge-empty-color: gray;

    --header-bg: #eeeeee;
    
  }
  :global(button) {
    padding: 0.5rem;
    border: none;
    background: var(--button-bg);
    border-radius: 0.5rem;
    cursor: pointer;
    margin: 1rem auto;
    padding: 1rem 1.5rem;
    display: block;
    font-weight: bold;
    color: var(--button-color);

  }

  :global(button:disabled) {
    background: var(--button-bg-disabled);
    color: var(--button-color-disabled);
  }

  :global(button:hover:not(:disabled)) {
    background: var(--button-bg-hover);
    color: var(--button-color-hover);
  }
</style>
