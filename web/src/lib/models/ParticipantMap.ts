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
  addParticipant(name: string) {
    this.participants[name] = new Participant(name, []);
  }

  // Insert given knowledge into given participant or update existing knowledge
  setKnowledgeOfParticipant(participant: string, knowledge: ParticipantKnowledge) {
    this.participants[participant].setKnowledge(knowledge);
  }

  // Check if participant has knowledge of given key
  checkKeyKnowledge(participant: string, key: Type): boolean {
    return this.participants[participant].doesKnowledgeExist({ type: "rawKnowledge", knowledge: key });
  }

  clearKnowledgeElement(knowledge: ParticipantKnowledge) {
    Object.keys(this.participants).forEach((participant: string) => this.participants[participant].clearKnowledgeElement(knowledge));
  }

  transferKnowledge(senderId: string, receiverId: string, knowledge: ParticipantKnowledge) {
    // Error handling
    if (senderId == receiverId) throw new Error("Sender and receiver cannot be the same! You cannot send something to yourself!");
    const sender = this.participants[senderId];
    const receiver = this.participants[receiverId];
    if (!sender) throw new Error("Sender not found!");
    if (!receiver) throw new Error("Receiver not found!");

    if (this.isSimpleKnowledge(knowledge)) return;
    if(!sender.doesKnowledgeExist(knowledge)) {
      console.error("Knowledge not found!", this.participants[senderId].getName(), knowledge);
      //return;
    }
    const tmp_knowledge = sender.getKnowledge(knowledge);
    receiver.setKnowledge(tmp_knowledge);
  }

  isSimpleKnowledge(knowledge: ParticipantKnowledge): boolean {
    if(knowledge.type === "rawKnowledge") {
      return knowledge.knowledge.type == "string" || knowledge.knowledge.type == "number";
    }
    return knowledge.knowledge.every((item) => this.isSimpleKnowledge(item));
  }
}
