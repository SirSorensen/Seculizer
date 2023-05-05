<script lang="ts">
  export let input: string;
  import katex from "katex";
  let TexOutput: string = "";
  $: {
    if(input.startsWith("$")) input = input.slice(1);
    if(input.endsWith("$")) input = input.slice(0, -1);
    TexOutput = katex.renderToString(input, {
      throwOnError: false,
      displayMode: true,
    });
  }
</script>

{@html TexOutput}

<style>
  :global(.katex-display){
    margin: 0rem .2rem;
    font-size: inherit;
    max-width: 100%;
  }
</style>