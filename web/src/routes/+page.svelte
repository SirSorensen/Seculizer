<script lang="ts">
  import parse from "$lang";
  import Editor from "$lib/components/Editor.svelte";
  import FileUpload from "$lib/components/FileUpload.svelte";
  import Frame from "$lib/components/Frame.svelte";
  import Header from "$lib/components/Header.svelte";
  import Participants from "$lib/components/Participants.svelte";
  import { Program } from "$lib/program";
  import { test } from "$lib/test.js";
  let content = test.replaceAll(";", ";\n").replaceAll("{ ", "{\n ").replaceAll("} ", "}\n ");
  let program: Program | undefined = undefined;
  let error: string | undefined = undefined;
  function parseContent() {

    error = undefined;
    let ast;
    try {
      ast = parse(content, false);
    } catch (errorMsg: any) {
      console.error(errorMsg);
      error = errorMsg.message;
      return;
    }
    program = new Program(ast, true);
  }
</script>

<div id="main">
  <Header />
  <div id="content">
    {#if program && program.first}
      <Frame frame={program.first} />
    {:else}
      {#if error}
        <p class="error">{error}</p>
      {/if}
      <FileUpload bind:content />
      <Editor bind:content />
      <button disabled={content.trim() === ""} on:click={parseContent}
        >Generate</button
      >
    {/if}
  </div>
</div>

<style>
  #main {
    display: flex;
    flex-direction: column;
    width: 100vw;
    min-height: 100vh;
  }

  #content {
    flex: 1;
    padding: 1rem;

    width: 60vw;
    margin: auto;
  }

  button {
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

  button:disabled {
    background: #f6f6f6;
  }

  button:hover:not(:disabled) {
    background: #f3e7c7;
  }

  .error {
    color: white;
    text-align: center;
    background: #d94141;
    margin: 0;
    padding: 1rem;
    font-weight: bold;
  }
</style>
