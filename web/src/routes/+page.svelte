<script>
  import CommonKnowledge from "$lib/CommonKnowledge.svelte";
  import MessageBox from "$lib/MessageBox.svelte";
    import Participants from "$lib/Participants.svelte";
</script>

<CommonKnowledge />

<MessageBox />
<MessageBox signie={{name: "Alice", emoji: "oma-woman"}} encryptKey={{id: "Key", emoji: "oma-key"}}/>

<Participants
    participants={[
        {
            Name: "Alice",
            Emoji: "oma-woman",
            Knowledge: [
                { id: "a_sk", emoji: "oma-key" },
                { id: "long text long text", emoji: "oma-pregnant-woman" },
            ],
        },
        {
            Name: "Adversary",
            Emoji: "oma-smiling-face-with-horns",
            Knowledge: [
            ],
        },
        {
            Name: "Bob",
            Emoji: "oma-man",
            Knowledge: [
                { id: "b_sk", emoji: "oma-key" },
                { id: "long text long text", emoji: "oma-pregnant-man" },
            ],
        },
    ]}
/>