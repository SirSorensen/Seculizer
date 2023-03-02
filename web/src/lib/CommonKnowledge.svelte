<script lang="ts">
    let knowledges:{Id:string, Emoji:String}[] = [
        { Id: "g", Emoji: "⚙️" },
        { Id: "your mom phone number", Emoji: "🤰🤙" },
        { Id: "your dad phone number", Emoji: "🫃🤙" },
    ];

</script>
<div class="container">
    <p class="header">Common knowledge</p>
    <div class="knowledges">
        {#each knowledges as knowledge}
            <div class="knowledge">
                <p class="icon">{knowledge.Emoji}</p>
                <p>{knowledge.Id}</p>
            </div>
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
    align-items: center;
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
