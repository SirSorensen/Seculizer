<script lang="ts">
  import { parse } from "$lang";
  import Editor from "$lib/components/Editor.svelte";
  import FileUpload from "$lib/components/FileUpload.svelte";
  import Frame from "$lib/components/Frame.svelte";
  import Header from "$lib/components/Header.svelte";
  import NextButton from "$lib/components/navigation/NextButton.svelte";
  import PrevButton from "$lib/components/navigation/PrevButton.svelte";
  import LZString from "lz-string";
  import type { Navigation } from "src/types/app";
  import { Frame as FrameType } from "$lib/models/Frame";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { Program } from "$lib/models/program";
  import { test } from "$lib/utils/test.js";
  import { onMount } from "svelte";
  import { z } from "zod";
  let content = test.replaceAll(";", ";\n").replaceAll("{ ", "{\n ").replaceAll("} ", "}\n ");
  let program: Program | undefined = undefined;
  let error: string | undefined = undefined;
  let current: FrameType | null = null;
  let navigation: Navigation = {
    prev: null,
    next: null,
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
      program = new Program(ast, false);
    } catch (errorMsg: any) {
      console.error(errorMsg);
      error = errorMsg.message;
      return;
    }
    $page.url.searchParams.set("proto", LZString.compressToEncodedURIComponent(content));
    goto(`?${$page.url.searchParams.toString()}`);
    current = program.first;
    updateNavigation();
  }

  function updateNavigation() {
    if (!current || current === null) {
      navigation = {
        prev: null,
        next: null,
      };
    } else {
      navigation.prev = current.getPrev();
      const next = z.instanceof(FrameType).safeParse(current.getNext());
      navigation.next = null;
      if (next !== null) {
        navigation.next = next.success ? next.data : null;
      }
    }
  }

  function prevFrame() {
    if (current === null) return;
    current = navigation.prev;
    updateNavigation();
  }

  function nextFrame(frame: FrameType | string) {
    if (current === null) return;
    const isString = z.string().safeParse(frame).success;
    if (isString) {
      current = current.getNextFrame(frame as string);
    } else {
      current = frame as FrameType;
    }
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
        <Frame {program} frame={current} {nextFrame} />
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
      <button disabled={content.trim() === ""} on:click={parseContent}>Generate</button>
    </div>
  {/if}
</div>

<style>
  #main {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100vh;
  }

  #content {
    flex: 1;
    padding: 1rem;

    width: 60%;
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
