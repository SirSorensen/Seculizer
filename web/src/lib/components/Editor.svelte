<script lang="ts">
  export let content: string = "";
  let hightlighted = content;
  $: hightlighted = content.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
  let preElement: HTMLPreElement;

  function updateScroll(
    event: UIEvent & { currentTarget: EventTarget & HTMLTextAreaElement }
  ): any {
    const { scrollTop, scrollLeft } = event.currentTarget;
    preElement.scrollTop = scrollTop;
    preElement.scrollLeft = scrollLeft;
  }
</script>

<div class="editor-container">
  <textarea
    name="editor"
    class="editor"
    autocomplete="off"
    autocorrect="off"
    autocapitalize="off"
    spellcheck="false"
    data-gramm="false"
    data-gramm_editor="false"
    data-enable-grammarly="false"
    placeholder="Insert code here..."
    bind:value={content}
    on:scroll={updateScroll}
  />
  <pre class="highlighter" aria-hidden="true" bind:this={preElement}><code
      >{@html hightlighted}</code
    ></pre>
</div>

<style>
  .editor-container {
    position: relative;
    width: 100%;
    height: 400px;
    max-height: 80vh;
    margin: 0 auto;
  }
  .editor,
  .highlighter {
    width: 100%;
    height: 100%;
    resize: none;
    border: none;
    outline: none;
    padding: 1rem;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
    overflow: auto;
    white-space: nowrap;
  }
  .editor,
  .highlighter,
  .highlighter code {
    font-size: 15px;
    font-family: monospace;
    line-height: 20px;
    tab-size: 2;
    font-family: "Fira Code", monospace;
  }

  .editor {
    z-index: 1;
    color: transparent;
    background-color: transparent;
    caret-color: black;
    resize: none;
  }
  .highlighter {
    z-index: 0;
  }

  .highlighter code {
    white-space: pre;

    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
  }
</style>
