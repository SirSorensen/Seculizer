<script lang="ts">
  import type { Frame } from "$lib/utils/Frame";
  import { getStringFromType } from "$lib/utils/stringUtil";
  import CommonKnowledge from "./CommonKnowledge.svelte";
  import Participants from "./Participants.svelte";
  export let frame: Frame;

  $: console.log(frame);
  let participants: {
    Name: string;
    Emoji: string;
    Knowledge: { id: string; emoji: string }[];
  }[] = [];
  let commonKnowledge: { id: string; emoji: string }[] = [];

  $: {
    if (frame && frame.getParticipants()) {
      Object.keys(frame.getParticipants()).forEach((key) => {
        if (!frame) return;
        const participant = frame.getParticipants().getParticipant(key);
        const obj: {
          Name: string;
          Emoji: string;
          Knowledge: { id: string; emoji: string }[];
        } = {
          Name: participant.getName(),
          Emoji: "👨‍💻", //participant.emoji
          Knowledge: participant.getKnowledgeList().map((k) => {
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