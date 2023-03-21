<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import parse from "$lang";
  import Editor from "$lib/components/Editor.svelte";
  import FileUpload from "$lib/components/FileUpload.svelte";
  import Frame from "$lib/components/Frame.svelte";
  import Header from "$lib/components/Header.svelte";
  import NextButton from "$lib/components/navigation/NextButton.svelte";
  import PrevButton from "$lib/components/navigation/PrevButton.svelte";
  import { Program } from "$lib/program";
  import { test } from "$lib/test.js";
  import type { Frame as FrameType } from "$lib/utils/Frame";
  import LZString from "lz-string";
  import { onMount } from "svelte";
  let content = test
    .replaceAll(";", ";\n")
    .replaceAll("{ ", "{\n ")
    .replaceAll("} ", "}\n ");
  let program: Program | undefined = undefined;
  let error: string | undefined = undefined;
  let current: FrameType | null = null;
  let navigation: {
    prev: FrameType | null;
    nextOptions: { name: string; frame: FrameType }[];
  } = {
    prev: null,
    nextOptions: [],
  };

  onMount(() => {
    const proto = $page.url.searchParams.get("proto");
    if (proto !== null) {
      content = LZString.decompressFromEncodedURIComponent(proto);
      parseContent();
    }
  });

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
    
    $page.url.searchParams.set("proto", LZString.compressToEncodedURIComponent(content));
    goto(`?${$page.url.searchParams.toString()}`);

    program = new Program(ast, true);
    current = program.first;
    updateNavigation();
  }

  function updateNavigation() {
    if (current === null) {
      navigation = {
        prev: null,
        nextOptions: [],
      };
    } else {
      navigation.prev = current.getPrev();
      const next = current.getNext();
      navigation.nextOptions = [];
      if (next !== null) {
        if (Array.isArray(next)) {
          const list = next as { [id: string]: FrameType };
          for (const key in list) {
            navigation.nextOptions.push({
              name: key,
              frame: list[key],
            });
          }
        } else {
          navigation.nextOptions = [{ name: "", frame: next as FrameType }];
        }
      }
    }
  }

  function prevFrame() {
    if (current === null) return;
    current = navigation.prev;
    updateNavigation();
  }

  function nextFrame(frame: FrameType) {
    if (current === null) return;

    current = frame;
    updateNavigation();
  }
</script>

<div id="main">
  <Header />
  {#if program}
    {#if current !== null}
      <div class="program-container">
        <div class="button-area">
          <PrevButton {navigation} {prevFrame} />
        </div>
        <Frame frame={current} />
        <div class="button-area">
          <NextButton {navigation} {nextFrame} />
        </div>
      </div>
    {/if}
  {:else}
    <div id="content">
      {#if error}
        <p class="error">{error}</p>
      {/if}
      <FileUpload bind:content />
      <Editor bind:content />
      <button disabled={content.trim() === ""} on:click={parseContent}
        >Generate</button
      >
    </div>
  {/if}
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

  .program-container {
    display: grid;
    grid-template-columns: minmax(10%, 15%) auto minmax(10%, 15%);
    width: 100%;
    height: calc(100vh - 75px);
  }

  .button-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
