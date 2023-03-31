<script lang="ts">
  import { parse } from "$lang";
  import Editor from "$lib/components/Editor.svelte";
  import FileUpload from "$lib/components/FileUpload.svelte";
  import LZString from "lz-string";
  import { goto } from "$app/navigation";
  import { Program } from "$lib/models/program";
  import { program } from "$lib/stores/programStore.js";
  import {test} from "$lib/utils/test.js";
  let content = test.replaceAll(";", ";\n").replaceAll("{ ", "{\n ").replaceAll("} ", "}\n ");
  let error: string | undefined = undefined;

  function parseContent() {
    error = undefined;
    let ast;
    if(content.trim() === "") return;
    try {
      ast = parse(content, false);
      $program = new Program(ast, false);
    } catch (errorMsg: any) {
      console.error(errorMsg);
      error = errorMsg.message;
      return;
    }
    goto(`/prototype/${LZString.compressToEncodedURIComponent(content)}`);
  }
</script>

<div id="content">
  {#if error}
    <p class="error">{error}</p>
  {/if}
  <FileUpload bind:content />
  <Editor bind:content />
  <button disabled={content.trim() === ""} on:click={parseContent}>Generate</button>
</div>

<style>
  #content {
    flex: 1;
    padding: 1rem;

    width: 60%;
    margin: auto;
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
