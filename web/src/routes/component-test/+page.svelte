<script>
    import ActionBox from "$lib/components/messages/ActionBox.svelte";
    import CommonKnowledge from "$lib/components/CommonKnowledge.svelte";
    import MessageBox from "$lib/components/messages/MessageBox.svelte";
    import Participants from "$lib/components/Participants.svelte";
    import Item from "$lib/components/Item.svelte";
  </script>
  
  <CommonKnowledge />
  <ActionBox title="test">
    <Item id="test" emoji="oma-key" />
  </ActionBox>
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
        Knowledge: [],
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
  