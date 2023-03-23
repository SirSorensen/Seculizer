<script lang="ts">
  import { SepoLexer } from "$lang";
  export let content: string = "";
  let hightlighted = content;
  type TokenType = {
    name: string;
    pattern: RegExp;
    tokenTypeIdx: number;
    CATEGORIES: string[];
    categoryMatches: any[];
    categoryMatchesMap: any;
    isParent: boolean;
  };
  type Token = {
    image: string;
    startOffset: number;
    endOffset: number;
    startLine: number;
    startColumn: number;
    endColumn: number;
    tokenTypeIdx: number;
    tokenType: TokenType;
  };
  let tokens: Token[] = [];
  
  $: {
    tokens = SepoLexer.tokenize(content + "eof").tokens;
    let offset = 0;
    let tmp = content;
    tokens.forEach((token) => {
      let type = token.tokenType.name;
      if (type === "End") return;
      let area = tmp.substring(token.startOffset + offset, token.endOffset + offset + 1);
      let start = tmp.substring(0, token.startOffset + offset);
      let end = tmp.substring(token.endOffset + offset + 1);
      const addBefore = `<span class="token token-${type}">`;
      const addAfter = `</span>`;
      tmp = start + addBefore + area + addAfter + end;
      offset += addBefore.length + addAfter.length;
    });

    hightlighted = tmp;
  }
  let preElement: HTMLPreElement;

  function updateScroll(event: UIEvent & { currentTarget: EventTarget & HTMLTextAreaElement }): any {
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
  <pre class="highlighter" aria-hidden="true" bind:this={preElement}><code>{@html hightlighted}</code></pre>
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

  :global(.token.token-Participants),  :global(.token.token-Knowledge), :global(.token.token-KeyRelations), :global(.token.token-Icons), :global(.token.token-Protocol), :global(.token.token-Format), :global(.token.token-Functions){
    color: rgb(0, 47, 255);
  }
  :global(.token.token-Id) {
    color: rgb(183, 0, 255);
  }
  :global(.token.token-Comma), :global(.token.token-Semicolon), :global(.token.token-Colon) {
    color: rgb(31, 31, 31);
  }
  :global(.token.token-LeftBrace), :global(.token.token-RightBrace) {
    color: red;
  }
  :global(.token.token-LeftParen) {
    color: red;
  }
  :global(.token.token-secretKey) {
    color: red;
  }
  :global(.token.token-publicKey) {
    color: red;
  }
  :global(.token.token-RightParen) {
    color: red;
  }
  :global(.token.token-Slash) {
    color: red;
  }
  :global(.token.token-NumberLiteral) {
    color: red;
    font-style: italic;
  }
  :global(.token.token-Equal) {
    color: red;
  }
  :global(.token.token-latexLiteral) {
    color: rgb(111, 0, 255);
    font-style: italic;
  }
  
  :global(.token.token-Arrow) {
    color: red;
  }
  :global(.token.token-StringLiteral) {
    color: rgb(46, 46, 46);
    font-style: italic;
  }
  :global(.token.token-Set) {
    color: red;
  }
  :global(.token.token-New) {
    color: red;
  }
  :global(.token.token-Pipe) {
    color: red;
  }
  :global(.token.token-Clear) {
    color: red;
  }
  :global(.token.token-Match) {
    color: red;
  }
  :global(.token.token-End) {
    color: red;
  }
</style>
