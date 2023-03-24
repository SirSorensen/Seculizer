<script>
  import ActionBox from "$lib/components/messages/ActionBox.svelte";
  import CommonKnowledge from "$lib/components/CommonKnowledge.svelte";
  import MessageBox from "$lib/components/messages/MessageBox.svelte";
  import Participants from "$lib/components/Participants.svelte";
  import Item from "$lib/components/Item.svelte";
  import Emoji from "../../lib/components/Emoji.svelte";
    import Latex from "$lib/components/Latex.svelte";
</script>
<!--
<CommonKnowledge />
<ActionBox title="test">
  <Item value="test" emoji="key" />
</ActionBox>
-->

<Latex input="$x^2$" />
<Latex input="$x^3$" />
$$x^3$$
<Emoji content="👨‍👨‍👧‍👧" />
<Emoji content="👨" />
<Emoji content="heart-with-arrow" />
<!--<MessageBox signie={{ name: "Alice", emoji: "oma-woman" }}>
    <MessageBox encryptKey={{ id: "Key", emoji: "oma-key" }}>
      <MessageBox encryptKey={{ id: "Key", emoji: "oma-key" }}>
        <Item id="test" emoji="oma-key" />
      </MessageBox>
  
      <Item id="test" emoji="oma-key" />
      <MessageBox encryptKey={{ id: "Key", emoji: "oma-key" }}>
          <MessageBox encryptKey={{ id: "Key", emoji: "oma-key" }}>
              <MessageBox signie={{ name: "Key", emoji: "oma-key" }}>
                  <Item id="test" emoji="oma-key" />
                </MessageBox>
            </MessageBox>
        </MessageBox>
    </MessageBox>
  </MessageBox>
  <MessageBox
    signie={{ name: "Alice", emoji: "oma-woman" }}
    encryptKey={{ id: "Key", emoji: "oma-key" }}
  >
    <Item id="test" emoji="oma-key" />
  </MessageBox>-->
<Emoji />
<!--
<Participants
  participants={[
    {
      Name: {type: "id", value: "Alice"},
      Emoji: "woman",
      Knowledge: [
        { id: "a_sk", emoji: "key" },
        { id: "long text long text", emoji: "pregnant-woman" },
      ],
    },
    {
      Name: "Adversary",
      Emoji: "smiling-face-with-horns",
      Knowledge: [],
    },
    {
      Name: "Bob",
      Emoji: "man",
      Knowledge: [
        { id: "b_sk", emoji: "key" },
        { id: "long text long text", emoji: "pregnant-man" },
      ],
    },
  ]}
/>-->
