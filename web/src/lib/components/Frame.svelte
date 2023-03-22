<script lang="ts">
  import type { Frame } from "$lib/models/Frame";
  import { getIconFromType, getStringFromType } from "$lib/utils/stringUtil";
  import CommonKnowledge from "./CommonKnowledge.svelte";
  import Statement from "./messages/Statements/Statement.svelte";
  import type { Statement as StatementAST } from "$lang/types/parser/interfaces";
  import Participants from "./Participants.svelte";
  import type { Program } from "$lib/models/program";
  export let frame: Frame;
  export let program: Program;

  $: console.log("Current frame:", frame);
  let participants: {
    Name: string;
    Emoji: string;
    Knowledge: { id: string; emoji: string }[];
  }[] = [];
  let commonKnowledge: { id: string; emoji: string }[] = [];
  let presentation: StatementAST | null = null;
  $: {
    participants = [];
    if (frame && frame.getParticipantMap()) {
      for (const key in frame.getParticipantMap().getParticipants()) {
        const participant = frame.getParticipantMap().getParticipant(key);

        const obj: {
          Name: string;
          Emoji: string;
          Knowledge: { id: string; emoji: string }[];
        } = {
          Name: participant.getName(),
          Emoji: program.getIcon(participant.getName()), //participant.emoji
          Knowledge: participant.getKnowledgeList().map((k) => {
            return { id: getStringFromType(k.id), emoji: getIconFromType(k.id, program) };
          }),
        };
        if (obj.Name === "Shared") commonKnowledge = obj.Knowledge;
        else participants.push(obj);

        participants = participants;
      }
    }
    presentation = frame.getPresentation();
  }

  let participantElements: {container: HTMLElement | undefined, elements: { [key: string]: HTMLElement }} = {container: undefined, elements: {}};
</script>

<div class="frame">
  <CommonKnowledge knowledges={commonKnowledge} />
  <div class="participants" bind:this={participantElements.container}>
    <Participants bind:participantElements={participantElements.elements} {participants} />
  </div>
  {#if presentation !== null}
    {#key JSON.stringify(presentation)}
    <Statement participantElements={participantElements} {program} statement={presentation} />
    {/key}
  {/if}
</div>

<style>
  .frame {
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .participants {
    flex: 1;
  }
</style>
