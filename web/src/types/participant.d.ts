import type { Expression, Type } from "$lang/types/parser/interfaces";
interface ParticipantElements {
  container: HTMLElement | undefined;
  elements: { [key: string]: HTMLElement };
}

type VisualKnowledge = { knowledge: ParticipantKnowledge, emoji: string };

type ParticipantKnowledge = RawParticipantKnowledge | EncryptedParticipantKnowledge;

type RawParticipantKnowledge = {
  type: "rawKnowledge";
  knowledge: Type;
  value: string;
};

type EncryptedParticipantKnowledge = {
  type: "encryptedKnowledge";
  knowledge: ParticipantKnowledge[];
  encryption: Type;
};