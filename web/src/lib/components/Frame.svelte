<script lang="ts">
  import type { frame } from "$lib/program";
  import Participants from "./Participants.svelte";
  export let frame: frame;

  $: console.log(frame);
  let participants: {
    Name: String;
    Emoji: String;
    Knowledge: { id: String; emoji: String }[];
  }[] = [];
  $: {
    if (frame && frame.participants) {
      Object.keys(frame.participants).forEach((key) => {
        if (!frame) return;
        const participant = frame.participants[key];
        const obj: {
          Name: String;
          Emoji: String;
          Knowledge: { id: String; emoji: String }[];
        } = {
          Name: participant.name,
          Emoji: "👨‍💻", //participant.emoji
          Knowledge: participant.knowledge.map((k) => {
            return { id: k.id, emoji: "👨‍💻" };
          })
        };
        participants.push(obj);
      });
    }
  }
</script>
<Participants participants={participants} />
