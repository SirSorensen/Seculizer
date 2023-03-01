<script lang="ts">
    import Participant from "./participant.svelte";
    export let participants: {Name:String,Emoji:String,Knowledge:{Id:String, Emoji:String} []} [] = [];
</script>

<div class="container">
    {#each participants as parti}
        <Participant name={parti.Name} emoji={parti.Emoji} knowledge={parti.Knowledge}/>
    {/each}
</div>

<style>
    div.container {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
</style>
