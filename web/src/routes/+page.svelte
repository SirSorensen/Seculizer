<script>
  import CommonKnowledge from "$lib/CommonKnowledge.svelte";
    import Participants from "$lib/participants.svelte";
</script>

<CommonKnowledge />

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