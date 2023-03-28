import type { EncryptExpression, Type } from "$lang/types/parser/interfaces";
import type { ParticipantKnowledge } from "src/types/participant";

export class Participant {
  private name: string;
  private knowledge: ParticipantKnowledge[];

  constructor(name: string, knowledge: ParticipantKnowledge[] = []) {
    this.name = name;
    this.knowledge = knowledge;
  }

  setKnowledge(knowledge: ParticipantKnowledge) {
    let index = this.findKnowledgeIndex(knowledge);

    if (index >= 0) {
      this.knowledge[index] = knowledge;
    } else {
      this.knowledge.push(knowledge);
    }
  }


  findKnowledgeIndex(element: ParticipantKnowledge): number {
    return this.knowledge.findIndex((item) => this.isKnowledgeEqual(item, element));
  }

  doesKnowledgeExist(element: ParticipantKnowledge): boolean {
    return this.findKnowledgeIndex(element) >= 0;
  }

  clearKnowledgeElement(elem: ParticipantKnowledge) {
    this.knowledge = this.knowledge.filter((item: ParticipantKnowledge) => !this.isKnowledgeEqual(item, elem));
  }

  getKnowledge(knowledge: ParticipantKnowledge): ParticipantKnowledge {
    let result = this.knowledge.find((item) => this.isKnowledgeEqual(item, knowledge));

    if (result === undefined) {
      return knowledge;
    }
    return result;
  }

  cloneKnowledgeList(): ParticipantKnowledge[] {
    return structuredClone(this.knowledge);
  }

  getKnowledgeList(): ParticipantKnowledge[] {
    return this.knowledge;
  }

  getName(): string {
    return this.name;
  }

  isKnowledgeEqual(knowledgeA: ParticipantKnowledge, knowledgeB: ParticipantKnowledge): boolean {
    if (knowledgeA.type === "rawKnowledge" && knowledgeB.type === "rawKnowledge") {
      return JSON.stringify(knowledgeA.knowledge) === JSON.stringify(knowledgeB.knowledge);
    } else if (knowledgeA.type === "encryptedKnowledge" && knowledgeB.type === "encryptedKnowledge") {
      if (JSON.stringify(knowledgeA.encryption) !== JSON.stringify(knowledgeB.encryption)) return false;
      if (knowledgeA.knowledge.length !== knowledgeB.knowledge.length) return false;
      const tmp = structuredClone(knowledgeB.knowledge);
      for (let i = 0; i < knowledgeA.knowledge.length; i++) {
        let knowledge = knowledgeA.knowledge[i];
        let index = tmp.findIndex((item) => this.isKnowledgeEqual(item, knowledge));
        if (index < 0) return false;
        tmp.splice(index, 1);
      }
      return tmp.length === 0;
    }
    return false;
  }
}
