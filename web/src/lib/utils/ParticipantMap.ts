import type { Statement, Type} from '$lang/types/parser/interfaces';
import { _Participant, type _knowledge } from './Participant';


export class ParticipantMap{
    private participants : {[id: string]: _Participant} = {}

    constructor(participants : {[id: string]: _Participant} = {}){
        this.participants = participants;
    }

    getParticipants() : {[id: string]: _Participant} {
        return this.participants;
    }

    // Add participant to map
    addParticipant(name : string, knowledge : _knowledge[] = []){
        this.participants[name] = new _Participant(name, knowledge)
    }

    setKnowledgeOfParticipant(participant : string, knowledge : Type, encrypted : boolean, value : string = ""){
        this.participants[participant].setKnowledge(knowledge, encrypted, value)
    }

    // Find value of knowledge of participant
    findKnowledgeValue(participant : string, knowledge : Type) : string{
        return this.participants[participant].getKnowledge(knowledge).value
    }

    // Check if participant has knowledge of given key
    checkKeyKnowledge(participant : string, key : Type) : boolean {
        return this.participants[participant].doesKnowledgeExist(key)
    }

    clearKnowledgeElement(elem : Type) {
        Object.keys(this.participants).forEach((participant: string) =>
            this.participants[participant].clearKnowledgeElement(elem)
        )
    }

    // Insert given knowledge into given participant or update existing knowledge, from given participants
    setKnowledge(participant : string, knowledge : Type, encrypted : boolean, value : string = "") {
        this.participants[participant].setKnowledge(knowledge, encrypted, value)
    }
    
    transferKnowledge(sender : string, receiver : string, knowledge : Type, encrypted : boolean | null = null){
        let tmp_knowledge = this.participants[sender].getKnowledge(knowledge)

        if (encrypted == null) this.participants[receiver].setKnowledge(tmp_knowledge.id, tmp_knowledge.encrypted, tmp_knowledge.value)
        else this.participants[receiver].setKnowledge(tmp_knowledge.id, encrypted, tmp_knowledge.value)
    }
}