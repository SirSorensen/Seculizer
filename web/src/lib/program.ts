//import "../../../Language/dist/dist/dts/parser/interfaces"
import type { Participant, Statement, ParticipantStatement, 
    SendStatement,
    MatchStatement,
    KnowledgeItem,
    Type,
    FunctionDefItem,
    FormatItem,
    Expression,
    MatchCase} from '$lang/types/parser/interfaces';


type _participant = {
    name: string
    knowledge: _knowledge[]
}

type _knowledge = {
    id: string
    value: string
    encrypted : boolean
}

type participantMap = {[id: string]: _participant}

export type frame = {
    next : frame | {[id: string]: frame}
    prev : frame
    participants :  participantMap
    presentation : Statement
} | null

type _format = {
    //Function
    id: string
    params: string[]

    //Latex
    latex: string
}

export class Program {
    init_participants: participantMap = {}

    first : frame = null

    keyRelations: {[id: string]: string} = {}
    functions: {[id: string]: Number} = {}
    formats: {[id: string]: _format} = {}
    equations: {[id: string]: string} = {}
    icons: {[id: string]: string} = {}

    constructor(json: any, log: boolean = false) {
        if (log) console.log("Program started!");

        // Check if json is valid
        if (json.type != "program" ) {
            throw new Error("Invalid json")
        }

        // Participants:
        // Create participants
        if (json.participants){
            console.log(json.participants.participants);
            
            json.participants.participants.forEach((participant: Participant) => {
                this.init_participants[participant.id.value] = {
                    name: participant.id.value,
                    knowledge: []
                }
            })
            if (log) console.log("Participants created", this.init_participants);
        } else if (log) console.log("No participants found");
        

        // Add shared knowledge
        this.init_participants["Shared"] = {
            name: "Shared",
            knowledge: []
        }

        // Knowledge:
        // Add knowledge to participants
        if (json.knowledge){
            json.knowledge.knowledge.forEach((knowledge: KnowledgeItem) => {
                knowledge.children.forEach((child: Type) => {
                    if (child.type == "function") throw new Error("Invalid json: stmnt child value type not implemented");
                    else {
                        this.init_participants[knowledge.id.value].knowledge.push({
                            id: String(child.value),
                            value: "",
                            encrypted: false
                        })
                    }
                })
            })
            if (log) console.log("Knowledge added to participants", this.init_participants);
        } else if (log) console.log("No knowledge found");
        


        // KeyRelations:
        if (json.keyRelations){
            json.keyRelations.keyRelations.forEach((keyRelation: any) => 
                this.keyRelations[keyRelation.name] = keyRelation.value
            )
            if (log) console.log("KeyRelations created", this.keyRelations);
        } else if (log) console.log("No keyRelations found");

        // Functions:
        if (json.functions){
            json.functions.functions.forEach((func: FunctionDefItem) =>
                this.functions[func.id.value] = func.params
            )
            if (log) console.log("Functions created", this.functions);
        } else if (log) console.log("No functions found");


        // Equations:
        if (json.equations) {
            json.equations.equations.forEach((equation: any) => {
                let tmp_equation = equation.left.latex
                equation.right.params.forEach((param: any) => {
                    tmp_equation = tmp_equation.replace(param.id, param.value)
                })
                this.equations[equation.left.id] = tmp_equation
            })
            if (log) console.log("Equations created", this.equations);
        } else if (log) console.log("No equations found");

        // Format:
        // Add format to functions
        if (json.format){
            json.format.formats.forEach((format: FormatItem) => {

                let tmp_format : _format = {
                    id: format.function.id,
                    params: [],
                    latex: format.format.value
                }

                format.function.params.forEach((param: Type) => {
                    if (param.type == "function") throw new Error("Invalid json: stmnt child value type not implemented");
                    else tmp_format.params.push(String(param.value));
                })

                this.formats[format.function.id] = tmp_format

            })

            if (log) console.log("Formats created", this.formats);
        } else if (log) console.log("No formats found");


        // Icons:
        if (json.icons){
            this.icons = json.icons.icons
            if (log) console.log("Icons created", this.icons);
        } else if (log) console.log("No icons found");

        //Setup first frame
        let last = this.newFrame(null, this.init_participants, this.first)
        if (this.first == null) throw new Error("Invalid json: no first frame created! First frame not properly initialized")
        
        // Protocol:
        if (json.protocol.statements){
            this.first.next = this.parseProtocol(json.protocol.statements, last)
        } else if (log) console.log("No protocol found");
        
        console.log("Program created");
    }

    parseProtocol(statements: Statement[] | Statement, last : frame) : frame {
        if (last == null) throw new Error("Invalid json: last frame not properly initialized")

        if (statements instanceof Array && statements.length > 0) 
        {
            let stmnt = statements.shift()
            if (stmnt == undefined) throw new Error("Invalid json: stmnt is undefined! Check if statements array is empty (parseProtocol)")

            last.next = this.parseProtocol(stmnt, last)
            if (last.next == null) throw new Error("Invalid json: next frame not properly initialized! (parseProtocol)")
            if (statements.length > 0) last.next.next = this.parseProtocol(statements, last)
        } 
        else if (!(statements instanceof Array))
        {
            let stmnt = statements
            
            if (stmnt.child.type == "sendStatement" && stmnt.child.child.type == "matchStatement"){                    
                    last.next = {}
                    for (const caseIndex in stmnt.child.child.cases) {
                        const matchCase = stmnt.child.child.cases[caseIndex];
                        last.next[caseIndex] = this.parseProtocol(matchCase.children, last.next[caseIndex])
                    }
            } else {
                let tmp_participants = this.pipeStmnt(stmnt, last.participants)
                last = this.newFrame(stmnt, tmp_participants, last)
            }
        }
        
        return last;
        
    }

    newFrame(stmnt : any, participants: participantMap, last : frame) : frame{
        let tmp_last = {
            next: null,
            prev: last,
            participants: participants,
            presentation: stmnt
        }

        if (last != null) last.next = tmp_last
        else this.first = tmp_last

        return tmp_last
    }

    checkIfMatchStmnt(stmnt: Statement) : boolean{
        return stmnt.child.type == "sendStatement" && stmnt.child.child.type == "matchStatement"
    }

    pipeStmnt(stmnt: Statement, participants: participantMap | undefined) : participantMap{
        if (!participants) throw new Error("Invalid json: participants is undefined");

        switch (stmnt.child.type) {
            case "clearStatement":
                return this.clearStmnt(stmnt.child.id.value, participants)
            case "participantStatement":
                return this.participantStmnt(stmnt.child, participants)
                // TODO: create methond for newStatement
            case "sendStatement":
                return this.sendStmnt(stmnt.child, participants)
                // TODO: create methond for newStatement
            default:
                throw new Error("Invalid json: stmnt type not found");    
        }
    }

    clearStmnt(knowledge: string, participants: participantMap) : participantMap{
        Object.keys(participants).forEach((participant: string) => {
            participants[participant].knowledge =  participants[participant].knowledge.filter(
                                                            (item: _knowledge) => item.id != knowledge
                                                        )
        })
        return participants;
    }

    participantStmnt(stmnt : ParticipantStatement, participants: participantMap) : participantMap{        
        // Pipe ParticipantStatement
        if (stmnt.child.type == "newStatement"){
            return this.newStmnt(stmnt.id.value, stmnt.child.id.value, participants)
        } else if (stmnt.child.type == "setStatement"){
            if (stmnt.child.value.type == "function") throw new Error("Invalid json: stmnt child value type not implemented");
            else return this.setStmnt(stmnt.id.value, stmnt.child.id.value, String(stmnt.child.value.value), participants)
        } else {
            throw new Error("Invalid json: stmnt child type not implemented");
        }
    }

    // New Statement
    newStmnt(participant : string, newKnowledge : string, participants: participantMap) : participantMap{
        return this.setKnowledge(participant, newKnowledge, participants, true)
    }

    // Set Statement
    setStmnt(participant : string, knowledge : string, value : string, participants: participantMap) : participantMap{
        return this.setKnowledge(participant, knowledge, participants, true, value)
    }

    // Pipe SendStatement to messageSendStatement, or matchStatement
    sendStmnt(stmnt : SendStatement, participants: participantMap) : participantMap{
        if (stmnt.child.type == "messageSendStatement"){
            return this.messageSendStmnt(stmnt.leftId.value, stmnt.rightId.value, stmnt.child.expressions, participants)
        } else if (stmnt.child.type == "matchStatement"){
            return this.matchStmnt(stmnt.child, participants)
        } else {
            throw new Error("Invalid json: stmnt child type not implemented");
        }
    }

    // Pipe MessageSendStatement to encryptExpression, signExpression, or setStatement
    messageSendStmnt(senderId : string,  receiverId : string, knowledge : Expression[], participants: participantMap, encrypted : boolean = false) : participantMap{
        knowledge.forEach((expression) => {
            if(expression.child.type == "encryptExpression"){
                participants = this.encryptExpr(senderId, receiverId, expression.child.inner, expression.child.outer, participants, encrypted)
            } else if(expression.child.type == "signExpression"){
                participants = this.messageSendStmnt(senderId, receiverId, expression.child.inner, participants, encrypted)
            } else {
                if (expression.child.type == "function") throw new Error("Invalid json: stmnt child value type not implemented");
                let val = this.findKnowledgeValue(senderId, String(expression.child.value), participants)
                participants = this.setKnowledge(receiverId, String(expression.child.value), participants, encrypted, val)
            }
        })
        return participants
    }

    // TODO : implement matchStmnt
    matchStmnt(stmnt : MatchStatement, participants: participantMap) : participantMap{
        return participants
    }

    // Acoomodate encryption of knowledge in messages
    encryptExpr(senderId : string, receiverId : string, inner : Expression[], outer : Type, participants: participantMap, encrypted : boolean) : participantMap{
        // if receiver was unable to decrypt an outer expression earlier, it cannot be decrypted now
        if (!encrypted){
            // decryptable = true if receiver knows the key, it is therefore not encrypted
            let decryptable = this.checkKeyKnowledge(receiverId, outer, participants)
            encrypted = !decryptable
        }

        return this.messageSendStmnt(senderId, receiverId, inner, participants, encrypted)
    }

    // Insert given knowledge into given participant or update existing knowledge, from given participants
    setKnowledge(participant : string, knowledge : string, participants: participantMap, encrypted : boolean, value : string = "") : participantMap{
        let index = participants[participant].knowledge.findIndex((element) => element.id == knowledge)

        if (index >= 0) {
            participants[participant].knowledge[index] = {
                id: knowledge,
                value: value,
                encrypted: encrypted
            }
        } else {
            participants[participant].knowledge.push({
                id: knowledge,
                value: value,
                encrypted: encrypted
            })
        }

        return participants
    }

    // Find value of knowledge of participant
    findKnowledgeValue(participant : string, knowledge : string, participants: participantMap) : string{
        let index = participants[participant].knowledge.findIndex((element) => element.id == knowledge)

        if (index >= 0) {
            return participants[participant].knowledge[index].value
        } else {
            return ""
        }
    }

    // Check if participant has knowledge of given key
    checkKeyKnowledge(participant : string, key : Type,  participants: participantMap) : boolean {
        if (key.type == "function") throw new Error("Invalid json: key type not implemented");
        let key_str = String(key)
        
        // Check if key has a key relation
        let tmp_key = this.keyRelations[key_str]
        if (tmp_key) key_str = tmp_key

        let index = participants[participant].knowledge.find((element) => element.id == key_str)

        return (index != undefined)
    }    
}

