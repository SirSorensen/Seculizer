import type { Type } from "$lang/types/parser/interfaces";
import type { ParticipantKnowledge } from "src/types/participant";
import { Participant } from "./Participant";

export class ParticipantMap {
  private participants: { [id: string]: Participant } = {};

  constructor(participants: { [id: string]: Participant } = {}) {
    Object.keys(participants).forEach(
      (participant: string) =>
        (this.participants[participant] = new Participant(participant, participants[participant].cloneKnowledgeList()))
    );
  }

  getParticipants(): { [id: string]: Participant } {
    return this.participants;
  }

  getParticipantsNames(): string[] {
    return Object.keys(this.participants);
  }

  getParticipantAmount(): number {
    return Object.keys(this.participants).length;
  }

  getParticipant(name: string): Participant {
    return this.participants[name];
  }

  // Add participant to map
  addParticipant(name: string, knowledge: ParticipantKnowledge[] = []) {
    this.participants[name] = new Participant(name, knowledge);
  }

  // Insert given knowledge into given participant or update existing knowledge
  setKnowledgeOfParticipant(participant: string, knowledge: ParticipantKnowledge) {
    this.participants[participant].setKnowledge(knowledge);
  }

  // Find value of knowledge of participant
  findKnowledgeValue(participant: string, knowledge: ParticipantKnowledge): string {
    const result = this.participants[participant].getKnowledge(knowledge);
    if(result.type === "rawKnowledge") {
      return result.value;
    }
    return "";
  }

  // Check if participant has knowledge of given key
  checkKeyKnowledge(participant: string, key: Type): boolean {
    return this.participants[participant].doesKnowledgeExist({ type: "rawKnowledge", knowledge: key, value: "" });
  }

  clearKnowledgeElement(knowledge: ParticipantKnowledge) {
    Object.keys(this.participants).forEach((participant: string) => this.participants[participant].clearKnowledgeElement(knowledge));
  }

  transferKnowledge(sender: string, receiver: string, knowledge: ParticipantKnowledge) {
    // Error handling
    if (sender == receiver) throw new Error("Sender and receiver cannot be the same! You cannot send something to yourself!");
    if (!this.participants[sender]) throw new Error("Sender not found!");
    if (!this.participants[receiver]) throw new Error("Receiver not found!");

    if (this.isSimpleKnowledge(knowledge)) return;

    let tmp_knowledge = this.participants[sender].getKnowledge(knowledge);

    this.participants[receiver].setKnowledge(tmp_knowledge);
  }

  isSimpleKnowledge(knowledge: ParticipantKnowledge): boolean {
    if(knowledge.type === "rawKnowledge") {
      return knowledge.knowledge.type == "string" || knowledge.knowledge.type == "number";
    }
    return knowledge.knowledge.every((item) => this.isSimpleKnowledge(item));
  }
}
