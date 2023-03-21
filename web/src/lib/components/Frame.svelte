<script lang="ts">
  import type { Frame } from "$lib/utils/Frame";
  import { getStringFromType } from "$lib/utils/stringUtil";
  import CommonKnowledge from "./CommonKnowledge.svelte";
  import Participants from "./Participants.svelte";
  export let frame: Frame;

  $: console.log("Current frame:", frame);
  let participants: {
    Name: string;
    Emoji: string;
    Knowledge: { id: string; emoji: string }[];
  }[] = [];
  let commonKnowledge: { id: string; emoji: string }[] = [];

  $: {
    participants = [];
    if (frame && frame.getParticipants()) {
      for (const key in frame.getParticipants().getParticipants()) {
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
          }),
        };
        if (obj.Name === "Shared") commonKnowledge = obj.Knowledge;
        else participants.push(obj);

        participants = participants;
      }
    }
  }
</script>

<div class="frame">
  <CommonKnowledge knowledges={commonKnowledge} />
  <div class="participants">
    <Participants {participants} />
  </div>
</div>

<style>
  .frame {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .participants {
    flex: 1;
  }
</style>
