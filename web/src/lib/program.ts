//import "../../../Language/dist/dist/dts/parser/interfaces"
import type { Participant, Statement, ParticipantStatement, 
    SendStatement,
    MatchStatement,
    KnowledgeItem,
    Type,
    FunctionDefItem,
    FormatItem,
    Expression,
    MatchCase,
    KeyRelation} from '$lang/types/parser/interfaces';

import { Frame } from './utils/Frame';
import { _Participant } from './utils/Participant';
import { ParticipantMap } from './utils/ParticipantMap';

type _format = {
    //Function
    id: string
    params: Type[]

    //Latex
    latex: string
}

export class Program {
    init_participants: ParticipantMap = new ParticipantMap()

    first : Frame | null = null

    keyRelations: {[id: string]: string} = {}
    functions: {[id: string]: Number} = {}
    formats: {[id: string]: _format} = {}
    equations: {[id: string]: string} = {}
    icons: {[id: string]: string} = {}
    log : boolean = false

    constructor(json: any, log: boolean = false) {
        this.log = log
        if (this.log) console.log("Program started!");

        // Check if json is valid
        if (json.type != "program" ) {
            throw new Error("Invalid json")
        }

        // Participants:
        // Create participants
        if (json.participants){
            console.log(json.participants.participants);
            
            json.participants.participants.forEach((participant: Participant) => {
                this.init_participants.addParticipant(participant.id.value)
            })
            if (this.log) console.log("Participants created", this.init_participants);
        } else if (this.log) console.log("No participants found");
        

        // Add shared knowledge
        this.init_participants.addParticipant("Shared")

        if (this.log) console.log("Participants", this.init_participants);

        // Knowledge:
        // Add knowledge to participants
        if (json.knowledge){
            json.knowledge.knowledge.forEach((knowledge: KnowledgeItem) => {
                knowledge.children.forEach((child: Type) => {
                    this.init_participants.setKnowledgeOfParticipant(knowledge.id.value, child, false)
                })
            })
            if (this.log) console.log("Knowledge added to participants", this.init_participants);
        } else if (this.log) console.log("No knowledge found");
        


        // KeyRelations:
        if (json.keyRelations){
            json.keyRelations.keyRelations.forEach((keyRelation: KeyRelation) => {
                let sk = keyRelation.sk.value
                let pk = keyRelation.pk.value
                this.keyRelations[pk] = sk
            }
            )
            if (this.log) console.log("KeyRelations created", this.keyRelations);
        } else if (this.log) console.log("No keyRelations found");

        // Functions:
        if (json.functions){
            json.functions.functions.forEach((func: FunctionDefItem) =>
                this.functions[func.id.value] = func.params
            )
            if (this.log) console.log("Functions created", this.functions);
        } else if (this.log) console.log("No functions found");


        // Equations:
        if (json.equations) {
            json.equations.equations.forEach((equation: any) => {
                let tmp_equation = equation.left.latex
                equation.right.params.forEach((param: any) => {
                    tmp_equation = tmp_equation.replace(param.id, param.value)
                })
                this.equations[equation.left.id] = tmp_equation
            })
            if (this.log) console.log("Equations created", this.equations);
        } else if (this.log) console.log("No equations found");

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
                    tmp_format.params.push(param);
                })

                this.formats[format.function.id] = tmp_format

            })

            if (this.log) console.log("Formats created", this.formats);
        } else if (this.log) console.log("No formats found");


        // Icons:
        if (json.icons){
            this.icons = json.icons.icons
            if (this.log) console.log("Icons created", this.icons);
        } else if (this.log) console.log("No icons found");

        //Setup first frame
        this.first = new Frame(null, null, this.init_participants)
        if (this.log) console.log("First frame created", this.first);
        if (this.first == null) throw new Error("Invalid json: no first frame created! First frame not properly initialized")
        
        // Protocol:
        if (json.protocol.statements){
            this.parseProtocol(json.protocol.statements, this.first)
            if (this.log) console.log("Protocol created", this.first);
        } else if (this.log) console.log("No protocol found");
        
        console.log("Program created");
    }

    parseProtocol(statements: Statement[] | Statement, last : Frame) {
        if (last == null) throw new Error("Invalid json: last frame not properly initialized")

        if (statements instanceof Array && statements.length > 0) 
        {
            let stmnt = statements.shift()
            if (stmnt == undefined) throw new Error("Invalid json: stmnt is undefined! Check if statements array is empty (parseProtocol)")

            this.parseProtocol(stmnt, last)
            if (last.isNextNull()) throw new Error("Invalid json: next frame not properly initialized! (parseProtocol)")
            if (statements.length > 0) this.parseProtocol(statements, last.getNext() as Frame)
        } 
        else if (!(statements instanceof Array))
        {
            let stmnt = statements
            
            if (stmnt.child.type == "sendStatement" && stmnt.child.child.type == "matchStatement"){                    
                    last.setNext({})
                    for (const caseIndex in stmnt.child.child.cases) {
                        const matchCase = stmnt.child.child.cases[caseIndex];

                        last.setMatchCase(caseIndex)

                        this.parseProtocol(matchCase.children, last.getNextFrame(caseIndex))
                    }
            } else {
                last.setNext(Frame.newFrame(stmnt, last.getParticipants(), last))
                this.pipeStmnt(stmnt, last.getNext() as Frame)
            }
        }
    }

    checkIfMatchStmnt(stmnt: Statement) : boolean{
        return stmnt.child.type == "sendStatement" && stmnt.child.child.type == "matchStatement"
    }

    pipeStmnt(stmnt: Statement, last: Frame){
        if (this.log) console.log("Piping statement", stmnt);
        
        switch (stmnt.child.type) {
            case "clearStatement":
                this.clearStmnt(stmnt.child.id, last)
                break
            case "participantStatement":
                this.participantStmnt(stmnt.child, last)
                break
            case "sendStatement":
                this.sendStmnt(stmnt.child, last)
                break
            default:
                throw new Error("Invalid json: stmnt type not found!");    
        }
    }

    clearStmnt(knowledge: Type, last: Frame) {
        last.clearKnowledgeElement(knowledge)
    }

    participantStmnt(stmnt : ParticipantStatement, last: Frame){        
        // Pipe ParticipantStatement
        if (stmnt.child.type == "newStatement"){
            this.newStmnt(stmnt.id.value, stmnt.child.id, last)
        } else if (stmnt.child.type == "setStatement"){
            this.setStmnt(stmnt.id.value, stmnt.child.id, String(stmnt.child.value), last)
        } else {
            throw new Error("Invalid json: stmnt child type not implemented");
        }
    }

    // New Statement
    newStmnt(participant : string, newKnowledge : Type, last: Frame) {
        last.setKnowledge(participant, newKnowledge, false)
    }

    // Set Statement
    setStmnt(participant : string, knowledge : Type, value : string, last: Frame) {
        last.setKnowledge(participant, knowledge, false, value)
    }

    // Pipe SendStatement to messageSendStatement, or matchStatement
    sendStmnt(stmnt : SendStatement, last: Frame){
        if (stmnt.child.type == "messageSendStatement"){
            this.messageSendStmnt(stmnt.leftId.value, stmnt.rightId.value, stmnt.child.expressions, last)
        } else if (stmnt.child.type == "matchStatement"){
            return this.matchStmnt(stmnt.child, last)
        } else {
            throw new Error("Invalid json: stmnt child type not implemented");
        }
    }

    // Pipe MessageSendStatement to encryptExpression, signExpression, or setStatement
    messageSendStmnt(senderId : string,  receiverId : string, knowledge : Expression[], last : Frame, encrypted : boolean = false) {
        knowledge.forEach((expression) => {
            if(expression.child.type == "encryptExpression"){
                this.encryptExpr(senderId, receiverId, expression.child.inner, expression.child.outer, last, encrypted)
            } else if(expression.child.type == "signExpression"){
                this.messageSendStmnt(senderId, receiverId, expression.child.inner, last, encrypted)
            } else {
                last.transferKnowledge(senderId, receiverId, expression.child, encrypted)
            }
        })
    }

    // TODO : implement matchStmnt
    matchStmnt(stmnt : MatchStatement, last: Frame) {
        
    }

    // Acoomodate encryption of knowledge in messages
    encryptExpr(senderId : string, receiverId : string, inner : Expression[], outer : Type, last: Frame, encrypted : boolean) {
        // if receiver was unable to decrypt an outer expression earlier, it cannot be decrypted now
        if (!encrypted){
            // decryptable = true if receiver knows the key, it is therefore not encrypted
            let decryptable = last.getParticipants().checkKeyKnowledge(receiverId, this.checkKeyRelation(outer))
            encrypted = !decryptable
        }

        this.messageSendStmnt(senderId, receiverId, inner, last, encrypted)
    }

    checkKeyRelation(key : Type) : Type{
        if (key.type == "id") {
            let tmp_key = this.keyRelations[key.value]
            if (tmp_key) key.value = tmp_key
        }
        return key
    }
}

