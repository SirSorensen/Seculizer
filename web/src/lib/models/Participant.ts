import type { Type } from "$lang/types/parser/interfaces";

export type knowledge = {
  id: Type;
  value: string;
  encrypted: boolean;
};

export class Participant {
  private name: string;
  private knowledge: knowledge[];

  constructor(name: string, knowledge: knowledge[] = []) {
    this.name = name;
    this.knowledge = knowledge;
  }

  setKnowledge(knowledge: Type, encrypted: boolean, value: string = "") {
    let tmpknowledge = {
      id: knowledge,
      value: value,
      encrypted: encrypted,
    };

    let index = this.findKnowledgeIndex(knowledge);

    if (index >= 0) {
      this.knowledge[index] = tmpknowledge;
    } else {
      this.knowledge.push(tmpknowledge);
    }
  }

  findKnowledgeIndex(element: Type): number {
    return this.knowledge.findIndex((item) => JSON.stringify(item.id) == JSON.stringify(element));
  }

  doesKnowledgeExist(element: Type): boolean {
    return this.findKnowledgeIndex(element) >= 0;
  }

  clearKnowledgeElement(elem: Type) {
    this.knowledge = this.knowledge.filter((item: knowledge) => JSON.stringify(item.id) != JSON.stringify(elem));
  }

  getKnowledge(knowledge: Type): knowledge {
    let result = this.knowledge.find((item) => JSON.stringify(item.id) == JSON.stringify(knowledge));

    if (result === undefined) {
      console.error("Knowledge not found!");

      return {
        id: knowledge,
        value: "",
        encrypted: false,
      };
    }
    return result;
  }

  cloneKnowledgeList(): knowledge[] {
    return structuredClone(this.knowledge);
  }

  getKnowledgeList(): knowledge[] {
    return this.knowledge;
  }

  getName(): string {
    return this.name;
  }
}
