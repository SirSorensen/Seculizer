<script lang="ts">
  import Editor from "$lib/Editor.svelte";
  let content = "";

  let parsed: any = undefined;
  
  function parseContent() {
    fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    })
      .then((res) => res.json())
      .then((data) => {
        parsed = data;
      });
  }
</script>

{#if parsed}
  <pre>{JSON.stringify(parsed, null, 2)}</pre>
{:else}
  <Editor bind:content />
  <button disabled={content.trim() === ""} on:click={parseContent}>Generate</button>
{/if}
