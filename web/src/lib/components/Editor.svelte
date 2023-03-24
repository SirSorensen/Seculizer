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
  let dark = true;
</script>

<input type="checkbox" name="dark-mode" id="darkinput" bind:checked={dark} />
<div class="editor-container" class:dark>
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
    /*Colors from https://github.com/ayu-theme/ayu-colors*/
    --ecolor-highlight: #55b4d4;
    --ecolor-keyword: #f2ae49;
    --ecolor-string: #86b300;
    --ecolor-number: #a37acc;
    --ecolor-regex: #4cbf99;
    --ecolor-error: #f07171;
    --ecolor-special: #fa8d3e;
    --ecolor-text: #5c6166;
    --ecolor-bg: #f8f9fa;
  }

  .editor-container.dark {
    --ecolor-highlight: #5ccfe6;
    --ecolor-keyword: #ffd173;
    --ecolor-string: #d5ff80;
    --ecolor-number: #dfbfff;
    --ecolor-regex: #95e6cb;
    --ecolor-error: #f28779;
    --ecolor-special: #ffad66;
    --ecolor-text: #cccac2;
    --ecolor-bg: #1f2430;
  }
  .editor-container {
    position: relative;
    width: 100%;
    height: 400px;
    max-height: 80vh;
    margin: 0 auto;
    background-color: var(--ecolor-bg);
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
    background-color: var(--ecolor-bg);
  }

  .highlighter code {
    white-space: pre;
    background-color: var(--ecolor-bg);
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
  }

  .editor-container :global(.token) {
    background-color: var(--ecolor-bg);
    color: var(--ecolor-text);
  }

  .editor-container :global(.token.token-Participants),
  .editor-container :global(.token.token-Knowledge),
  .editor-container :global(.token.token-KeyRelations),
  .editor-container :global(.token.token-Icons),
  .editor-container :global(.token.token-Protocol),
  .editor-container :global(.token.token-Format),
  .editor-container :global(.token.token-Functions) {
    color: var(--ecolor-special);
  }
  .editor-container :global(.token.token-Id),
  .editor-container :global(.token.token-secretKey),
  .editor-container :global(.token.token-publicKey) {
    color: var(--ecolor-keyword);
  }
  .editor-container :global(.token.token-Comma),
  .editor-container :global(.token.token-Semicolon),
  .editor-container :global(.token.token-Colon) {
    color: var(--ecolor-text);
  }
  .editor-container :global(.token.token-LeftBrace),
  .editor-container :global(.token.token-RightBrace) {
    color: var(--ecolor-text);
  }
  .editor-container :global(.token.token-LeftBrace + .token.token-Pipe),
  .editor-container :global(.token.token-Pipe + .token.token-RightBrace),
  .editor-container :global(.token.token-LeftBrace:has(+ .token.token-Pipe)),
  .editor-container :global(.token.token-Pipe:has(+ .token.token-RightBrace)) {
    color: var(--ecolor-text);
    font-variant: none;
    
  }

  .editor-container :global(.token.token-LeftParen),
  .editor-container :global(.token.token-RightParen) {
    color: var(--ecolor-text);
  }
  .editor-container :global(.token.token-Slash) {
    color: var(--ecolor-text);
  }
  .editor-container :global(.token.token-NumberLiteral) {
    color: var(--ecolor-number);
    font-style: italic;
  }
  .editor-container :global(.token.token-Equal),
  .editor-container :global(.token.token-Arrow) {
    color: var(--ecolor-text);
  }
  .editor-container :global(.token.token-latexLiteral) {
    color: var(--ecolor-regex);
    font-style: italic;
  }
  .editor-container :global(.token.token-StringLiteral) {
    color: var(--ecolor-string);
    font-style: italic;
  }
  .editor-container :global(.token.token-Set),
  .editor-container :global(.token.token-New),
  .editor-container :global(.token.token-Pipe),
  .editor-container :global(.token.token-Clear),
  .editor-container :global(.token.token-Match),
  .editor-container :global(.token.token-End) {
    color: var(--ecolor-special);
  }
</style>
