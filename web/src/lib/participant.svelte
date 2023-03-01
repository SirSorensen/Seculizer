<script lang="ts">
	export let name: String;
    export let emoji: String;
    export let knowledge: {Id:String, Emoji:String} [] = [];
</script>

<div class="container">
    <div class="elem">
        <p class="emoji">{emoji}</p>
        <p>{name}</p>
    </div>
    {#each knowledge as {Id,Emoji}}
        <div class="elem">
            <p class="emoji">{Emoji}</p>
            <p>{Id}</p>
        </div>
    {/each}
</div>

<style>
    div.container {
        background-color: #fff3d3;
        align-items: center;
        font-size: 1.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 1000px;
        text-align: center;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
    }

    .emoji {
        font-size: 4rem;
    }

    p {
        margin: 0;    
    }

    .elem {
        padding: 1rem;
    }
</style>
