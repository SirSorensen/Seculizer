<script lang="ts">
  export let input: string;
  import katex from "katex";
  let latexOutput: string = "";
  $: {
    if(input.startsWith("$")) input = input.slice(1);
    if(input.endsWith("$")) input = input.slice(0, -1);
    latexOutput = katex.renderToString(input, {
      throwOnError: false,
      displayMode: false,
    });
  }
</script>

{@html latexOutput}
