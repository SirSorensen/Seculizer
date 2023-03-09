<script lang="ts">
  import Editor from "$lib/Editor.svelte";
  import Header from "$lib/Header.svelte";
  import {Program} from "$lib/program";
  import {test} from "$lib/test.js";
  let content = test;

  let parsed: any = undefined;

  function parseContent() {
    fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    })
      .then((res) => res.json())
      .then((data) => {
        new Program(data, true);
        parsed = data;
      })
  }
</script>

<div id="main">
  <Header />
  <div id="content">
    {#if parsed}
      <pre>{JSON.stringify(parsed, null, 2)}</pre>
    {:else}
      <Editor bind:content />
      <button disabled={content.trim() === ""} on:click={parseContent}>Generate</button>
    {/if}
  </div>
</div>
{#if parsed && !parsed}
  <pre>{JSON.stringify(parsed, null, 2)}</pre>
{:else}
  <Editor bind:content />
  <button disabled={content.trim() === ""} on:click={parseContent}>Generate</button>
{/if}

<style>
  #main{
    display: flex;
    flex-direction: column;
    width: 100vw;
    min-height: 100vh;
  }
  
  #content{
    flex:1;
    padding: 1rem;
  }

  button{
    padding: 0.5rem;
    border: none;
    background: #FFF3D3;
    border-radius: 0.5rem;
    cursor: pointer;
    margin: 1rem auto;
    padding: 1rem 1.5rem;
    display: block;
    font-weight: bold;
  }

  button:disabled{
    background: #f6f6f6;
  }

  button:hover:not(:disabled){
    background: #f3e7c7;
  }

</style>