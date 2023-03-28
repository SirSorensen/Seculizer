<script lang="ts">
  import type { Frame } from "$lib/models/Frame";
  import { getIconFromType, getStringFromType } from "$lib/utils/stringUtil";
  import CommonKnowledge from "./CommonKnowledge.svelte";
  import Statement from "./messages/Statements/Statement.svelte";
  import type { Id, Statement as StatementAST } from "$lang/types/parser/interfaces";
  import Participants from "./Participants.svelte";
  import type { Program } from "$lib/models/program";
  import type { NextFrameNavigation } from "src/types/app";
  import type {ParticipantElements, ParticipantKnowledge, VisualKnowledge } from "src/types/participant";
  export let frame: Frame;
  export let program: Program;
  export let nextFrame: NextFrameNavigation = () => {};
  $: console.log("Current frame:", frame);
  let participants: {
    Name: Id;
    Emoji: string;
    Knowledge: VisualKnowledge[];
  }[] = [];
  let commonKnowledge: VisualKnowledge[] = [];
  let presentation: StatementAST | null = null;
  $: {
    participants = [];
    if (frame && frame.getParticipantMap()) {
      for (const key in frame.getParticipantMap().getParticipants()) {
        const participant = frame.getParticipantMap().getParticipant(key);

        const obj: {
          Name: Id;
          Emoji: string;
          Knowledge: VisualKnowledge[];
        } = {
          Name: { type: "id", value: participant.getName() },
          Emoji: program.getIcon(participant.getName()), //participant.emoji
          Knowledge: participant.getKnowledgeList().map((k: ParticipantKnowledge) => {
            const emoji = k.type === "encryptedKnowledge" ? "🔒" : getIconFromType(k.knowledge, program);
            return {
              knowledge: k,
              emoji: emoji
            }
            //return { id: k.id, value: k.value, emoji: k.encrypted ? "locked" : getIconFromType(k.id, program) };
          }),
        };
        if (obj.Name.value === "Shared") commonKnowledge = obj.Knowledge;
        else participants.push(obj);

        participants = participants;
      }
    }
    presentation = frame.getPresentation();
  }

  let participantElements: ParticipantElements = { container: undefined, elements: {} };

</script>

<div class="frame">
  <CommonKnowledge {program} knowledges={commonKnowledge} />
  <div class="participants" bind:this={participantElements.container}>
    <Participants {program} bind:participantElements={participantElements.elements} {participants} />
  </div>
  {#if presentation !== null}
    {#key JSON.stringify(presentation)}
      <Statement {participantElements} {program} {nextFrame} statement={presentation} />
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
