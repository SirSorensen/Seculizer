import type { StmtComment, Type } from "$lang/types/parser/interfaces";
import type { ParticipantKnowledge, RawParticipantKnowledge } from "src/types/participant";

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

  findKnowledgeIndex(element: ParticipantKnowledge, strict = false): number {
    return this.knowledge.findIndex(({ item }) => this.isKnowledgeEqual(item, element, strict));
  }

  doesKnowledgeExist(element: ParticipantKnowledge, strict = false): boolean {
    return this.findKnowledgeIndex(element, strict) >= 0;
  }

  doesTypeAndValueExist(type: Type, val: Type | undefined = undefined): boolean {
    return this.doesKnowledgeExist(
      {
        type: "rawKnowledge",
        knowledge: type,
        value: val,
      },
      true
    );
  }

  //TODO : Test this
  getValueOfKnowledge(knowledge: Type): Type | undefined {
    const partiKnowledge : RawParticipantKnowledge = {
      type: "rawKnowledge",
      knowledge: knowledge
    };
    const result = this.getKnowledge(partiKnowledge, false);

    if (result?.type === "rawKnowledge") return result?.value;
    else return undefined;
  }

  clearKnowledgeElement(elem: ParticipantKnowledge) {
    this.knowledge = this.knowledge.filter(({ item }) => !this.isKnowledgeEqual(item, elem));
  }

  getKnowledge(knowledge: ParticipantKnowledge, strict = false): ParticipantKnowledge | undefined {
    const result = this.knowledge.find(({ item }) => this.isKnowledgeEqual(item, knowledge, strict));
    return result?.item;
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

  isKnowledgeEqual(knowledgeA: ParticipantKnowledge, knowledgeB: ParticipantKnowledge, strict = false): boolean {
    if (knowledgeA.type === "rawKnowledge" && knowledgeB.type === "rawKnowledge") {
      const strA = JSON.stringify(knowledgeA.knowledge);
      const strB = JSON.stringify(knowledgeB.knowledge);
      return (
        JSON.stringify(knowledgeA.knowledge) === JSON.stringify(knowledgeB.knowledge) && // check if knowledge is the same
        (!strict || JSON.stringify(knowledgeA.value) === JSON.stringify(knowledgeB.value)) // if strict is true, then we need to check the value as well
      );
    } else if (knowledgeA.type === "encryptedKnowledge" && knowledgeB.type === "encryptedKnowledge") {
      if (JSON.stringify(knowledgeA.encryption) !== JSON.stringify(knowledgeB.encryption)) return false;
      if (knowledgeA.knowledge.length !== knowledgeB.knowledge.length) return false;
      const tmp = structuredClone(knowledgeB.knowledge);
      for (let i = 0; i < knowledgeA.knowledge.length; i++) {
        const knowledge = knowledgeA.knowledge[i];
        const index = tmp.findIndex((item) => this.isKnowledgeEqual(item, knowledge));
        if (index < 0) return false;
        tmp.splice(index, 1);
      }
      return tmp.length === 0;
    }
    return false;
  }

  getComment(): StmtComment | undefined {
    return this.comment;
  }
}
