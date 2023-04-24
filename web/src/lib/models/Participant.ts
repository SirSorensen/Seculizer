import type { StmtComment, Type } from "$lang/types/parser/interfaces";
import type { EncryptedParticipantKnowledge, ParticipantKnowledge, RawParticipantKnowledge } from "src/types/participant";
import { KnowledgeHandler } from "./KnowledgeHandler";

export class Participant {
  private name: string;
  private knowledge: { item: ParticipantKnowledge; id: number }[];
  private currentKnowledgeId = 0;
  private comment?: StmtComment;
  constructor(name: string, knowledge: { item: ParticipantKnowledge; id: number }[] = [], comment?: StmtComment) {
    this.name = name;
    this.comment = comment;

    this.knowledge = knowledge;
    this.knowledge.forEach(({ id }) => {
      if (id > this.currentKnowledgeId) this.currentKnowledgeId = id;
      else if (id === this.currentKnowledgeId) this.currentKnowledgeId++;
    });
  }

  setKnowledge(knowledge: ParticipantKnowledge) {
    const index = this.findKnowledgeIndex(knowledge);

    if (index >= 0) {
      const { item } = this.knowledge[index];
      if (knowledge.type === "rawKnowledge" && !knowledge.comment && item.type == "rawKnowledge") {
        knowledge.comment = item.comment;
      }
      this.knowledge[index] = { item: knowledge, id: this.currentKnowledgeId++ };
    } else {
      this.knowledge.push({ item: knowledge, id: this.currentKnowledgeId++ });
    }
  }

  removeKnowledge(knowledge: ParticipantKnowledge) {
    const index = this.findKnowledgeIndex(knowledge);
    if (index >= 0) {
      this.knowledge.splice(index, 1);
    }
  }

  findKnowledgeIndex(element: ParticipantKnowledge, strict = false): number {
    return this.knowledge.findIndex(({ item }) => KnowledgeHandler.compareKnowledge(item, element, strict));
  }

  doesKnowledgeExist(element: ParticipantKnowledge, strict = false): boolean {
    return this.findKnowledgeIndex(element, strict) >= 0;
  }

  //TODO : Test this
  getValueOfKnowledge(knowledge: Type): Type | undefined {
    const partiKnowledge: RawParticipantKnowledge = {
      type: "rawKnowledge",
      knowledge: knowledge,
    };
    const result = this.getKnowledge(partiKnowledge, false);

    if (result?.type === "rawKnowledge") return result?.value;
    else return undefined;
  }

  clearKnowledgeElement(elem: ParticipantKnowledge) {
    this.knowledge = this.knowledge.filter(({ item }) => !KnowledgeHandler.compareKnowledge(item, elem));
  }

  getKnowledge(knowledge: ParticipantKnowledge, strict = false): ParticipantKnowledge | undefined {
    const result = this.knowledge.find(({ item }) => KnowledgeHandler.compareKnowledge(item, knowledge, strict));
    return result?.item;
  }

  getParticipantKnowledgeFromKnowledge(knowledge: Type, inner: ParticipantKnowledge[] = []): ParticipantKnowledge {
    const tmpRawKnowledge: RawParticipantKnowledge = {
      type: "rawKnowledge",
      knowledge: knowledge,
    };
    let result = this.getKnowledge(tmpRawKnowledge, false);

    // RawKnowledge not found, try to find encryptedKnowledge,
    // where inner = knowledge of encryptedKnowledge
    // and knowledge = encryption of encryptedKnowledge
    if (result === undefined && inner.length > 0) {
      const tmpEncKnowledge: EncryptedParticipantKnowledge = {
        type: "encryptedKnowledge",
        knowledge: inner,
        encryption: {
          type: "rawKnowledge",
          knowledge: knowledge,
        },
      };

      result = this.getKnowledge(tmpEncKnowledge, false);
    }

    if (result !== undefined) return result;
    else return tmpRawKnowledge;
  }

  getRawParticipantKnowledgeFromKnowledge(knowledge: Type): RawParticipantKnowledge {
    const tmpRawKnowledge: RawParticipantKnowledge = {
      type: "rawKnowledge",
      knowledge: knowledge,
      value: this.getValueOfKnowledge(knowledge)
    };
    return tmpRawKnowledge
  }

  cloneKnowledgeList(): { item: ParticipantKnowledge; id: number }[] {
    return structuredClone(this.knowledge);
  }

  getKnowledgeList(): { item: ParticipantKnowledge; id: number }[] {
    return this.knowledge;
  }

  getName(): string {
    return this.name;
  }

  getComment(): StmtComment | undefined {
    return this.comment;
  }
}
