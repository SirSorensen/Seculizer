<script lang="ts">
  import type { frame } from "$lib/program";
  import { getStringFromType } from "$lib/utils/stringUtil";
  import CommonKnowledge from "./CommonKnowledge.svelte";
  import Participants from "./Participants.svelte";
  export let frame: frame;

  $: console.log(frame);
  let participants: {
    Name: string;
    Emoji: string;
    Knowledge: { id: string; emoji: string }[];
  }[] = [];
  let commonKnowledge: { id: string; emoji: string }[] = [];

  $: {
    if (frame && frame.participants) {
      Object.keys(frame.participants).forEach((key) => {
        if (!frame) return;
        const participant = frame.participants[key];
        const obj: {
          Name: string;
          Emoji: string;
          Knowledge: { id: string; emoji: string }[];
        } = {
          Name: participant.name,
          Emoji: "👨‍💻", //participant.emoji
          Knowledge: participant.knowledge.map((k) => {
            return { id: getStringFromType(k.id), emoji: "👨‍💻" };
          })
        };
        if(obj.Name === "Shared") commonKnowledge = obj.Knowledge;
        else participants.push(obj);
      });
    }
  }
</script>
<CommonKnowledge knowledges={commonKnowledge} />
<Participants participants={participants} />
