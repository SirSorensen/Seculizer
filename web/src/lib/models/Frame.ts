import type { Id, Statement, StmtComment } from "$lang/types/parser/interfaces";
import type { ParticipantKnowledge } from "src/types/participant";
import type { Participant } from "./Participant";
import { ParticipantMap } from "./ParticipantMap";

export class Frame {
  private next: Frame | { [id: string]: Frame } | null;
  private prev: Frame | null;
  private participantMap: ParticipantMap;
  private presentation: Statement | null;
  private history: {string: string, mermaid: string}[];
  private hightlighted: { [id: string]: ParticipantKnowledge[] } = {};

  constructor(stmnt: Statement | null, prev: Frame | null, participantMap: ParticipantMap | { [id: string]: Participant }, history: {string: string, mermaid: string}[]) {
    this.next = null;
    this.prev = prev;

    if (participantMap instanceof ParticipantMap) this.participantMap = new ParticipantMap(participantMap.getParticipants());
    else this.participantMap = new ParticipantMap(participantMap);

    this.presentation = stmnt;
    this.history = history.concat([]); //Insure that it is a copy
  }

  setNext(frame: Frame | { [id: string]: Frame }, caseIndex = "") {
    if (caseIndex != "") {
      if (this.next != null && !(this.next instanceof Frame) && frame instanceof Frame) this.next[caseIndex] = frame;
      else console.error("Error: Next is not a map, however a caseIndex was given!");
    } else this.next = frame;
  }

  //TODO: Make it a clone?
  getNext(): Frame | { [id: string]: Frame } | null {
    return this.next;
  }

  // Get last frame
  getLast(): Frame {
    if (this.next === null) return this;
    if (this.next instanceof Frame) return this.next.getLast();
    else {
      const tmp_frame = this.next[Object.keys(this.next)[0]];
      return tmp_frame.getLast();
    }
  }

  //TODO: Make it a clone?
  getNextFrame(caseIndex = ""): Frame {
    if (this.next === null) throw new Error("Next is null");

    if (caseIndex != "") {
      return this.getNextWithIndex(caseIndex);
    } else if (!(this.next instanceof Frame)) {
      throw new Error("Next is a map!");
    }

    return this.next;
  }

  //TODO: Make it a clone?
  private getNextWithIndex(caseIndex: string): Frame {
    if (this.next === null) throw new Error("Next is null");
    if (this.next instanceof Frame) throw new Error("Next is a frame not a dictionary! Don't use caseIndex!");
    if (this.next[caseIndex] === undefined) throw new Error("Case index not found!");

    return this.next[caseIndex];
  }

  //Return the previous frame
  getPrev(): Frame | null {
    return this.prev;
  }

  setNextOfNext(frame: Frame) {
    if (this.next === null) {
      throw new Error("Next is null");
    } else {
      (this.next as Frame).setNext(frame);
    }
  }

  createNewMatchCase(stmnt:Statement | null, caseIndex: string) {
    if (this.next === null || this.next instanceof Frame) {
      this.next = {};
    }

    const tmp_frame = new Frame(stmnt, this, this.participantMap, this.history);

    this.next[caseIndex] = tmp_frame;
  }

  isNextNull(): boolean {
    return this.next === null;
  }

  getParticipantMap(): ParticipantMap {
    return this.participantMap;
  }

  //TODO: Mayve do this in a better way than static
  static newFrame(stmnt: Statement, participants: ParticipantMap, last: Frame): Frame {
    const tmp_last = new Frame(stmnt, last, participants, last.history);

    if (last != null) last.setNext(tmp_last);

    return tmp_last;
  }

  getPresentation(): Statement | null {
    return this.presentation;
  }

  getHistory(): {string: string, mermaid: string}[] {
    return this.history;
  }

  addToHistory(history: string, mermaid: string) {
    this.history.push({string: history, mermaid: mermaid});
  }

  getParticipantKnowledgeComment(participantId:string, id:Id): StmtComment | undefined {
    let knowledge = this.participantMap.getParticipant(participantId).getKnowledge({type: "rawKnowledge", knowledge: id});
    if (knowledge && knowledge.type == "rawKnowledge") return knowledge.comment;
    //Check shared
    knowledge = this.participantMap.getParticipant("Shared").getKnowledge({type: "rawKnowledge", knowledge: id});
    if (knowledge && knowledge.type == "rawKnowledge") return knowledge.comment;
    return undefined;
  }

  addHighlightedKnowledge(knowledge: ParticipantKnowledge, ...participants: string[]) {
    participants.push("Shared");
    for (const participant of participants) {
      const pKnowledge = this.participantMap.getParticipant(participant).getKnowledge(knowledge) ?? knowledge;
      if(this.hightlighted[participant]) this.hightlighted[participant].push(pKnowledge)
      else this.hightlighted[participant] = [pKnowledge];   
    }
  }

  getHighlightedKnowledge(participantId:string): ParticipantKnowledge[] {
    return this.hightlighted[participantId] || [];
  }

  shouldHightlightParticipant(participantId:string): boolean {
    return this.hightlighted[participantId] !== undefined;
  }
}
