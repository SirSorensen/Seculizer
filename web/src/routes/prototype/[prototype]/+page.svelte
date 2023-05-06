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
  
  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") navigation.prev && prevFrame();
    else if (event.key === "ArrowRight") navigation.next && nextFrame(navigation.next);
  }

</script>
<svelte:window on:keydown={handleKeyPress} />
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
    <svg width="134" height="142" viewBox="0 0 134 142" fill="none" class="seculizer-icon" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M70.7408 0.80872C69.5683 0.278869 68.3121 0 67 0C65.6879 0 64.4317 0.278869 63.2592 0.80872L10.6922 23.0903C4.55053 25.6838 -0.0277896 31.7353 0.000126979 39.0416C0.13971 66.7054 11.5297 117.32 59.63 140.327C64.2921 142.558 69.7079 142.558 74.37 140.327C122.47 117.32 133.86 66.7054 134 39.0416C134.028 31.7353 129.449 25.6838 123.308 23.0903L70.7408 0.80872ZM40.4513 79.8123C41.7913 80.1469 43.215 80.3142 44.6667 80.3142C54.5213 80.3142 62.5333 72.3107 62.5333 62.4666V44.619H74.8725C78.2504 44.619 81.3491 46.5153 82.8566 49.555L84.8666 53.5428H102.733C105.19 53.5428 107.2 55.5507 107.2 58.0047V66.9285C107.2 79.2545 97.2058 89.238 84.8666 89.238H71.4667V103.377C71.4667 105.412 69.8196 107.086 67.7537 107.086C67.2512 107.086 66.7488 106.974 66.3021 106.779L38.7484 94.9827C36.9059 94.2019 35.7334 92.3892 35.7334 90.4093C35.7334 89.6284 35.9009 88.8755 36.2638 88.1783L40.4513 79.8123ZM40.2001 44.619H51.3667H53.6V53.5428V62.4666C53.6 67.4026 49.608 71.3904 44.6667 71.3904C39.7255 71.3904 35.7334 67.4026 35.7334 62.4666V49.0809C35.7334 46.6269 37.7434 44.619 40.2001 44.619ZM75.9333 58.0047C75.9333 56.8213 75.4627 55.6864 74.6251 54.8497C73.7874 54.0129 72.6513 53.5428 71.4667 53.5428C70.282 53.5428 69.1459 54.0129 68.3083 54.8497C67.4706 55.6864 67 56.8213 67 58.0047C67 59.1881 67.4706 60.323 68.3083 61.1597C69.1459 61.9965 70.282 62.4666 71.4667 62.4666C72.6513 62.4666 73.7874 61.9965 74.6251 61.1597C75.4627 60.323 75.9333 59.1881 75.9333 58.0047Z"
      />
    </svg>

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
  .loading .seculizer-icon {
    height: 1.5rem;
    width: 1.5rem;
    fill: black;
    animation: squareDelay 5s .5s infinite cubic-bezier(0.09, 0.57, 0.49, 0.9);
    animation-fill-mode: both;
    perspective: 2rem;
    display: block;
    margin-right: 0.5rem;
  }
  @keyframes squareDelay {
    25% {
      -webkit-transform: rotateX(180deg) rotateY(0);
      transform: rotateX(180deg) rotateY(0);
      fill: #162392;
    }
    50% {
      -webkit-transform: rotateX(180deg) rotateY(180deg);
      transform: rotateX(180deg) rotateY(180deg);
      fill: #e0b220;
    }
    75% {
      -webkit-transform: rotateX(0) rotateY(180deg);
      transform: rotateX(0) rotateY(180deg);
      fill: #e06020;
    }
    100% {
      -webkit-transform: rotateX(0) rotateY(0);
      transform: rotateX(0) rotateY(0);
      fill: black;
    }
  }
</style>
