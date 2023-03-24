import type { Type } from "$lang/types/parser/interfaces";
interface ParticipantElements {
  container: HTMLElement | undefined;
  elements: { [key: string]: HTMLElement };
}

type KnowledgeList = { id: Type; emoji: string }[];
