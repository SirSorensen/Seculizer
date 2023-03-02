<script lang="ts">
  import Item from "./Item.svelte";


    let knowledges:{id:string, emoji:String}[] = [
        { id: "g", emoji: "oma-gear" },
        { id: "long text long text", emoji: "oma-key" },
        { id: "even longer text long text", emoji: "oma-key" },
    ];

</script>
<div class="container">
    <p class="header">Common knowledge</p>
    <div class="knowledges">
        {#each knowledges as knowledge}
            <Item id={knowledge.id} emoji={knowledge.emoji}/>
        {/each}
    </div>
</div>

<style>
  .container {
    background: #fff3d3;
    width: fit-content;
    padding: 1rem 1.5rem;
    margin: .5rem auto;
    box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.25);
    font-size: 1.2rem;
    border-radius: 15px;
  }

  .knowledges{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: start;
  }

.header{
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    margin-bottom: .5rem;
    padding: 0;
    text-align: center;
}
.knowledge{
    max-width: 10rem;
}

.knowledge p {
    margin: 0 .5rem;
    text-align: center;
}

.knowledge .icon{
    font-size: 1.5rem;
}
</style>
