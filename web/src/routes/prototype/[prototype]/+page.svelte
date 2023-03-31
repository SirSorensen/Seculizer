<script lang="ts">
  import type { Navigation } from "src/types/app";
  import { onMount } from "svelte";
  import { Frame as FrameType } from "$lib/models/Frame.js";
  import { parse } from "$lang";
  import { page } from "$app/stores";
  import { z } from "zod";
  import { program } from "$lib/stores/programStore.js";
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
  let current: FrameType | null = null;
  onMount(() => {
    if($page.params.prototype === undefined) return;
    const proto = $page.params.prototype;
    if (proto !== null) {
      const content = LZString.decompressFromEncodedURIComponent(proto);
      if (content === null) return;
      parseContent(content);
    }
    updateNavigation();
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
    current = $program.first;
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
{#if error}
  <p class="error">{error}</p>
{/if}
{#if $program && current !== null}
  <div class="program-container">
    <div class="button-area">
      <PrevButton {navigation} {prevFrame} />
    </div>
    <Frame frame={current} {nextFrame} />
    <div class="button-area">
      <NextButton {navigation} {nextFrame} />
    </div>
  </div>
{:else}
  <p class="error">There is no program to display</p>
  <button><a href="/">Go back</a></button>
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
</style>
