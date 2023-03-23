<script lang="ts">
  export let input: string;
  import { onMount } from "svelte";
  let latexNode: string;
  let options = {
    display: true,
    em: 16,
    ex: 8,
    containerWidth: 80 * 16,
  };
  onMount(() => {
    let scripts = document.getElementsByTagName("script");
    //only add the script if it hasn't been added yet
    let scriptAdded = false;
    for (const script of scripts) {
      if (script.src === "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js") {
        scriptAdded = true;
      }
    }
    if (!scriptAdded) {
      let script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
      document.head.append(script);
      script.onload = () => {
        MathJax = {
          elements: document.getElementsByClassName("mathjax"),
          tex: {
            inlineMath: [
              ["$", "$"],
              ["\\(", "\\)"],
            ],
          },
          svg: { fontCache: "global" },
        };
      };
    }
  });
</script>

<div class="mathjax">
  <div>$${input}$$</div>
  <p>{input}</p>
</div>

<style>
  .mathjax {
    position: relative;
  }
  p {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
    color: transparent;
  }
</style>
