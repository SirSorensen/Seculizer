<script lang="ts">
  import Participant from "./Participant.svelte";
  export let participants: {
    Name: String;
    Emoji: String;
    Knowledge: { id: String; emoji: String }[];
  }[] = [];
</script>

<div class="container">
  {#each participants as parti}
    <Participant
      name={parti.Name}
      emoji={parti.Emoji}
      knowledge={parti.Knowledge}
    />
  {/each}
</div>

<style>
  div.container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-start;
  }
</style>
