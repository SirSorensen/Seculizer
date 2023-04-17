<script lang="ts">
  import type { Navigation } from "src/types/app";
  import { onMount } from "svelte";
  import { Frame as FrameType } from "$lib/models/Frame.js";
  import { parse } from "$lang";
  import { page } from "$app/stores";
  import { z } from "zod";
  import { program, currentFrame } from "$lib/stores/programStore.js";
  import { Program } from "$lib/models/program";
  import LZString from "lz-string";
  import Frame from "$lib/components/Frame.svelte";
  import PrevButton from "$lib/components/navigation/PrevButton.svelte";
  import NextButton from "$lib/components/navigation/NextButton.svelte";
  let error: string | undefined = undefined;
  let navigation: Navigation = {
    prev: null,
    next: null,
  };
  let loaded = false;
  onMount(() => {
    if ($page.params.prototype === undefined) return;
    const proto = $page.params.prototype;
    if (proto !== null) {
      const content = LZString.decompressFromEncodedURIComponent(proto);
      if (content === null) return;
      parseContent(content);
    }
    updateNavigation();
    loaded = true;
  });
  function parseContent(input: string) {
    error = undefined;
    let ast;
    try {
      ast = parse(input, false);
      $program = new Program(ast, false);
    } catch (errorMsg: any) {
      console.error(errorMsg);
      error = errorMsg.message;
      return;
    }
    if ($program.first === null) {
      error = "No frames found";
      return;
    }
    $currentFrame = $program.first;
  }
  function updateNavigation() {
    if (!$currentFrame || $currentFrame === null) {
      navigation = {
        prev: null,
        next: null,
      };
    } else {
      navigation.prev = $currentFrame.getPrev();
      const next = z.instanceof(FrameType).safeParse($currentFrame.getNext());
      navigation.next = null;
      if (next !== null) {
        navigation.next = next.success ? next.data : null;
      }
    }
  }

  function prevFrame() {
    if ($currentFrame === null) return;
    if (navigation.prev === null) {
      error = "Invalid previous frame";
      return;
    }
    $currentFrame = navigation.prev;
    updateNavigation();
  }

  function nextFrame(frame: FrameType | string) {
    if ($currentFrame === null) return;
    const isString = z.string().safeParse(frame).success;
    if (isString) {
      $currentFrame = $currentFrame.getNextFrame(frame as string);
    } else {
      $currentFrame = frame as FrameType;
    }
    updateNavigation();
  }
</script>

{#if error}
  <p class="error">{error}</p>
{/if}
{#if loaded}
  {#if $program && $currentFrame !== null}
    <div class="program-container">
      <div class="button-area">
        <PrevButton {navigation} {prevFrame} />
      </div>
      <Frame {nextFrame} />
      <div class="button-area">
        <NextButton {navigation} {nextFrame} />
      </div>
    </div>
  {:else}
    <p class="error">There is no program to display</p>
    <button><a href="/">Go back</a></button>
  {/if}
{:else}
  <div class="loading">
    <div class="square" />
    <p>Loading...</p>
  </div>
{/if}

<style>
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
  .error {
    color: white;
    text-align: center;
    background: #d94141;
    margin: 0;
    padding: 1rem;
    font-weight: bold;
  }
  .loading {
    font-size: 1.5rem;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: calc(100vh - 75px);
    transform: translateY(-75px);
  }
  .loading .square {
    height: 1.5rem;
    width: 1.5rem;
    background-color: #d94141;
    animation: squareDelay 5s 0s infinite cubic-bezier(0.09, 0.57, 0.49, 0.9);
    animation-fill-mode: both;
    perspective: 2rem;
    display: block;
    margin-right: 0.5rem;
  }
  @keyframes squareDelay {
    25% {
      background-color: #d94141;
      -webkit-transform: rotateX(180deg) rotateY(0);
      transform: rotateX(180deg) rotateY(0);
    }
    50% {
      background-color: #cad941;
      -webkit-transform: rotateX(180deg) rotateY(180deg);
      transform: rotateX(180deg) rotateY(180deg);
    }
    75% {
      background-color: #41d980;
      -webkit-transform: rotateX(0) rotateY(180deg);
      transform: rotateX(0) rotateY(180deg);
    }
    100% {
      background-color: #4150d9;
      -webkit-transform: rotateX(0) rotateY(0);
      transform: rotateX(0) rotateY(0);
    }
  }
</style>
