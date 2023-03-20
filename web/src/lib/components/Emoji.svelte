<script lang="ts">
  export let content: string = "red-question-mark";
  let omaEmoji:
    | { type: "background"; value: string }
    | { type: "class"; value: string } = {
    type: "class",
    value: "red-question-mark",
  };

  $: {
    if (containsLatinCodepoints(content)) {
      omaEmoji = { type: "class", value: content };
    } else {
      let hexArray: string[] = [];
      for (const codePoint of content) {
        let hex = codePoint.codePointAt(0);
        if (hex === undefined) continue;
        hexArray.push(hex.toString(16).toUpperCase());
      }

      omaEmoji = {
        type: "background",
        value: `https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@14.0.0/color/svg/${hexArray.join(
          "-"
        )}.svg`,
      };
    }
  }
  function containsLatinCodepoints(s: string): boolean {
    return /[\u0000-\u00ff]/.test(s);
  }
</script>

<p class="emoji">
  {#if omaEmoji.type === "class"}
    <i class="oma oma-{omaEmoji.value}" />
  {:else if omaEmoji.type === "background"}
    <i class="oma" style="background-image: url({omaEmoji.value})" />
  {/if}
</p>
<style>
  p{
    margin: 0;
  }
</style>