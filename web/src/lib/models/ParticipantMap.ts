import type { StmtComment } from "$lang/types/parser/interfaces";
import type { ParticipantKnowledge } from "src/types/participant";
import { Participant } from "./Participant";

export class ParticipantMap {
  private participants: { [id: string]: Participant } = {};

  constructor(participants: { [id: string]: Participant } = {}) {
    Object.keys(participants).forEach(
      (participant: string) =>
        (this.participants[participant] = new Participant(
          participant,
          participants[participant].cloneKnowledgeList(),
          participants[participant].getComment()
        ))
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
  addParticipant(name: string, comment?: StmtComment) {
    this.participants[name] = new Participant(name, [], comment);
  }

  // Insert given knowledge into given participant or update existing knowledge
  setKnowledgeOfParticipant(participant: string, knowledge: ParticipantKnowledge) {
    this.participants[participant].setKnowledge(knowledge);
  }

  clearKnowledgeElement(knowledge: ParticipantKnowledge) {
    Object.keys(this.participants).forEach((participant: string) => this.participants[participant].clearKnowledgeElement(knowledge));
  }
}
