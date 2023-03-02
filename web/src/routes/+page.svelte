<script>
    import Participants from "$lib/participants.svelte";
</script>

<h1>Welcome to SvelteKit</h1>
<p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
<p>Hello! I am alien from Florida!</p>

<Participants
    participants={[
        {
            Name: "Alice",
            Emoji: "👩",
            Knowledge: [
                { Id: "a_sk", Emoji: "🔑" },
                { Id: "your mom phone number", Emoji: "🤰🤙" },
            ],
        },
        {
            Name: "Adversary",
            Emoji: "😈",
            Knowledge: [
            ],
        },
        {
            Name: "Bob",
            Emoji: "👨",
            Knowledge: [
                { Id: "b_sk", Emoji: "🔑" },
                { Id: "your dad phone number", Emoji: "🫃🤙" },
            ],
        },
    ]}
/>