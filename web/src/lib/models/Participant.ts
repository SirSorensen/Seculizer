import type { ParticipantKnowledge } from "src/types/participant";

export class Participant {
  private name: string;
  private knowledge: { item: ParticipantKnowledge, id:number }[];
  private currentKnowledgeId = 0;
  constructor(name: string, knowledge: { item: ParticipantKnowledge, id:number }[] = []) {
    this.name = name;
    this.knowledge = knowledge;
    this.knowledge.forEach(({ id }) => {
      if(id > this.currentKnowledgeId) this.currentKnowledgeId = id;
      else if(id === this.currentKnowledgeId) this.currentKnowledgeId++;
    });
  }

  setKnowledge(knowledge: ParticipantKnowledge) {
    const index = this.findKnowledgeIndex(knowledge);

    if (index >= 0) {
      this.knowledge[index] = { item: knowledge, id: this.currentKnowledgeId++ };
    } else {
      this.knowledge.push({ item: knowledge, id: this.currentKnowledgeId++ });
    }
  }

  findKnowledgeIndex(element: ParticipantKnowledge): number {
    return this.knowledge.findIndex(({ item }) => this.isKnowledgeEqual(item, element));
  }

  doesKnowledgeExist(element: ParticipantKnowledge): boolean {
    return this.findKnowledgeIndex(element) >= 0;
  }

  clearKnowledgeElement(elem: ParticipantKnowledge) {
    this.knowledge = this.knowledge.filter(({ item }) => !this.isKnowledgeEqual(item, elem));
  }

  getKnowledge(knowledge: ParticipantKnowledge): ParticipantKnowledge {
    const result = this.knowledge.find(({ item }) => this.isKnowledgeEqual(item, knowledge));

    if (result === undefined) {
      return knowledge;
    }
    return result.item;
  }

  cloneKnowledgeList(): { item: ParticipantKnowledge, id:number }[] {
    return structuredClone(this.knowledge);
  }

  getKnowledgeList(): { item: ParticipantKnowledge, id:number }[] {
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
        const knowledge = knowledgeA.knowledge[i];
        const index = tmp.findIndex((item) => this.isKnowledgeEqual(item, knowledge));
        if (index < 0) return false;
        tmp.splice(index, 1);
      }
      return tmp.length === 0;
    }
    return false;
  }
}
