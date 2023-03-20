import type { Statement, Type} from '$lang/types/parser/interfaces';
import type { _Participant } from './Participant';
import { ParticipantMap } from './ParticipantMap';



export class Frame {
    private next : Frame | {[id: string]: Frame} | null
    private prev : Frame | null
    private participants : ParticipantMap
    private presentation : Statement | null

    constructor(stmnt : Statement | null, prev : Frame | null, participants : ParticipantMap | {[id: string]: _Participant}){
        this.next = null;
        this.prev = prev;
        if (participants instanceof ParticipantMap) this.participants = new ParticipantMap(participants.getParticipants());
        else this.participants = new ParticipantMap(participants);
        this.presentation = stmnt;
    }

    setNext(frame : Frame | {[id: string]: Frame}, caseIndex : string = ""){
        if(caseIndex != "" && this.next != null && !(this.next instanceof Frame) && frame instanceof Frame) this.next[caseIndex] = frame;
        else this.next = frame;
    }

    getNext(caseIndex : string = "") : Frame | {[id: string]: Frame} | null {
        if(caseIndex != "") {
            return this.getNextWithIndex(caseIndex)
        }

        return this.next;
    }

    getNextFrame(caseIndex : string = "") : Frame {
        if(caseIndex != "") {
            return this.getNextWithIndex(caseIndex)
        }

        if(this.next === null) throw new Error("Next is null");
        if(!(this.next instanceof Frame)) throw new Error("Next is a map!");

        return this.next;
    }

    getNextWithIndex(caseIndex : string) : Frame {
        if (this.next === null) throw new Error("Next is null");
        if (this.next instanceof Frame) throw new Error("Next is a frame not a dictionary! Don't use caseIndex!");
        if (this.next[caseIndex] === undefined) throw new Error("Case index not found!");
        
        return this.next[caseIndex];
    }


    setNextOfNext(frame : Frame){
        if(this.next === null){
            throw new Error("Next is null");
        } else {
            (this.next as Frame).setNext(frame);
        }
    }

    setMatchCase(caseIndex : string){
        if(this.next === null || this.next instanceof Frame){
            this.next = {};
        }

        let tmp_frame = new Frame(null, this, this.participants);

        this.next[caseIndex] = tmp_frame;
    }

    isNextNull() : boolean {
        return this.next === null;
    }

    getParticipants() : ParticipantMap {
        return this.participants;
    }



    static newFrame(stmnt : any, participants: ParticipantMap, last : Frame) : Frame{
        let tmp_last = new Frame(stmnt, last, participants)

        if (last != null) last.setNext(tmp_last)

        return tmp_last
    }

    
    clearKnowledgeElement(elem : Type) {
            this.participants.clearKnowledgeElement(elem)
    }

    // Insert given knowledge into given participant or update existing knowledge, from given participants
    setKnowledge(participant : string, knowledge : Type, encrypted : boolean, value : string = "") {
        this.participants.setKnowledge(participant, knowledge, encrypted, value)
    }
    
    transferKnowledge(sender : string, receiver : string, knowledge : Type, encrypted : boolean | null = null){
        this.participants.transferKnowledge(sender, receiver, knowledge, encrypted)
    }
}

    