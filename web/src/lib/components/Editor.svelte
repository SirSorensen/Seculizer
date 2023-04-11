<script lang="ts">
  /*
Participants: a;
Protocol: {
    a: k := f(x, y);
};
*/
  import { parse, ParseError, SepoLexer } from "$lang";
  import { Program } from "$lib/models/program";
  import MagicString from "magic-string";
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
  let ids: string[] = [];
  $: {
    if (content !== "" && content) {
      tokens = SepoLexer.tokenize(content + " eof").tokens;
      let tmp = new MagicString(content);
      tokens.forEach((token) => {
        let type = token.tokenType.name;
        if (type === "End") return;
        if (type === "Id") {
          if (!ids.includes(token.image)) ids.push(token.image);
        }
        const addBefore = `<span class="token token-${type}">`;
        const addAfter = `</span>`;

        tmp.update(token.startOffset, token.startOffset + token.image.length, addBefore + token.image + addAfter);
      });
      let re = /(\r\n)|\n/g;
      let match;
      let line = 0;
      tmp.prependLeft(0, `<span class="line">${line++}</span>`);
      while ((match = re.exec(content)) != null) {
        tmp.update(match.index, match.index + match[0].length, `</br><span class="line">${line++}</span>`);
      }
      try {
        let ast = parse(content, false);
        let program = new Program(ast, false);
        let icons = program.getIcons();
        let tmpIds: string[] = [];
        ids.forEach((id) => {
          if (id === "Shared") return;
          let icon = icons.get(id);
          if (!icon) {
            tmpIds.push(id);
          }
        });
        ids = tmpIds;
      } catch (e: any) {
        if (e instanceof Error && e instanceof ParseError) {
          let error = e as ParseError;
          let location = error.location;
          let addBefore = `<span class="token token-Error"><i class="tokenErrMsg">${error.msg}</i>`;

          if (location.start === 0) {
            addBefore = `<span class="line">0</span>` + addBefore;
          }
          const addAfter = `</span>`;
          tmp.prependLeft(location.start, addBefore);
          tmp.appendRight(location.end + 1, addAfter);
        } else {
          console.error(e);
        }
      }
      hightlighted = content.endsWith("\n") ? tmp.toString() + "\n" : tmp.toString();
    } else {
      hightlighted = `<span class="line">0</span>`;
    }
  }
  let preElement: HTMLPreElement;

  function updateScroll(event: UIEvent & { currentTarget: EventTarget & HTMLTextAreaElement }): any {
    const { scrollTop, scrollLeft } = event.currentTarget;
    preElement.scrollTop = scrollTop;
    preElement.scrollLeft = scrollLeft;
  }
  function mouseMove(e: { clientX: number; clientY: number }) {
    const errors = document.getElementsByClassName("token-Error");

    for (const errorBox of errors) {
      if (
        e.clientX > errorBox.getBoundingClientRect().left &&
        e.clientX < errorBox.getBoundingClientRect().right &&
        e.clientY > errorBox.getBoundingClientRect().top &&
        e.clientY < errorBox.getBoundingClientRect().bottom
      ) {
        errorBox.classList.add("hover");
      } else {
        errorBox.classList.remove("hover");
      }
    }
  }

  let dark = true;
</script>

<div class="editor-container" on:mousemove={mouseMove} class:dark>
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
  <div id="darkInputContainer">
    <label for="darkinput" class="darkmode">
      <span class="switchOption switchOption-dark" class:active={dark}>
        <i class="oma oma-crescent-moon" />
      </span>
      <span class="switchOption switchOption-light" class:active={!dark}>
        <i class="oma oma-sun" />
      </span>
    </label>
    <input type="checkbox" name="dark-mode" id="darkinput" bind:checked={dark} />
  </div>
</div>
{ids}

<style>
  .editor-container {
    /*Colors from https://github.com/ayu-theme/ayu-colors*/
    --ecolor-highlight: #55b4d4;
    --ecolor-keyword: #dc9f43;
    --ecolor-string: #516b03;
    --ecolor-comment: #607819;
    --ecolor-number: #a37acc;
    --ecolor-regex: #4cbf99;
    --ecolor-error: #f07171;
    --ecolor-special: #a0622c;
    --ecolor-text: #5c6166;
    --ecolor-bg: #f5f6f7;
    --ecolor-caret: black;
  }

  .editor-container.dark {
    --ecolor-highlight: #5ccfe6;
    --ecolor-keyword: #ffd173;
    --ecolor-string: #d5ff80;
    --ecolor-comment: #5e7c03;
    --ecolor-number: #dfbfff;
    --ecolor-regex: #95e6cb;
    --ecolor-error: #f28779;
    --ecolor-special: #f69846;
    --ecolor-text: #cccac2;
    --ecolor-bg: #1f2430;
    --ecolor-caret: white;
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
    color: var(--ecolor-comment);
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
    caret-color: var(--ecolor-caret);
    resize: none;
    padding-left: 1.3rem;
  }
  .highlighter {
    z-index: 0;
    background-color: var(--ecolor-bg);
    padding-left: 1.3rem;
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
  .editor-container :global(.token.token-Functions),
  .editor-container :global(.token.token-Equations) {
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
  .editor-container :global(.token.token-Error),
  .editor-container :global(.token.token-Error .token) {
    color: black;
    background-color: var(--ecolor-error);
    position: relative;
  }

  .editor-container :global(.tokenErrMsg) {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1;
    font-size: 0.8rem;
    background-color: var(--ecolor-error);
    min-width: 200px;
    max-width: 600px;
    white-space: normal;
    box-shadow: 0 0 5px;
    margin-top: 0.5rem;
    padding: 0.2rem;
  }

  .editor-container :global(.token.token-Error.hover .tokenErrMsg) {
    display: block;
  }
  .editor-container :global(.line) {
    position: absolute;
    left: 0;
    font-size: 0.6rem;
    vertical-align: middle;
    line-height: 1.2rem;
    transform: translateX(25%);
  }
  #darkInputContainer {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 2;
  }
  #darkInputContainer #darkinput {
    display: none;
  }
  .darkmode {
    background-color: #cccac2;
    display: flex;
  }
  span.switchOption {
    padding: 0.2rem 0.5rem;
    display: inline-block;
    margin: 0;
    box-shadow: 0px 0px 3px 0px #757575;
  }
  span.switchOption .oma {
    filter: grayscale(100%);
  }
  span.switchOption:hover {
    cursor: pointer;
  }
  span.switchOption.active {
    box-shadow: 0px 0px 3px 0px #757575, inset 0px 0px 3px 0px #757575;
    background: #ece9db;
  }
  span.switchOption.active .oma {
    filter: none;
  }
</style>
