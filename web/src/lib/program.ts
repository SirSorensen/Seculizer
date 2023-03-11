//import "../../../Language/dist/dist/dts/parser/interfaces"
import type { Statement } from '$lang/types/parser/interfaces';

type frame = {
    next : frame | {[id: string]: frame}
    prev : frame
    participants :  {[id: string]: _participant}
    presentation : Statement
} | null


type _participant = {
    name: string
    knowledge: string[]
}

type _format = {
    //Function
    id: string
    params: string[]
    //Latex
    latex: string
}

export class Program {
    init_participants: {[id: string]: _participant} = {}

    first : frame = null
    last : frame = null

    keyRelations: {[id: string]: string} = {}
    functions: {[id: string]: number} = {}
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
            json.participants.participants.forEach((participant: any) => {
                this.init_participants[participant.id] = {
                    name: participant.id,
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
            json.knowledge.knowledge.forEach((knowledge: any) => {
                knowledge.children.forEach((child: any) => {
                    this.init_participants[knowledge.id].knowledge.push(child.id)
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
            json.functions.functions.forEach((func: any) =>
                this.functions[func.id] = func.params
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
            json.format.formats.forEach((format: any) => {
                let tmp_format : _format = {
                    id: format.function.id,
                    params: [],
                    latex: format.function.latex
                }
                format.function.params.forEach((param: any) => {
                    tmp_format.params.push(param.id)
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
        this.newFrame(null, this.init_participants)
        
        // Protocol:

        if (json.protocol.statements){
            json.protocol.statements.forEach( (stmnt:any) => {
                let type = this.getStmntType(stmnt)
                let tmp_participants = this.last?.participants
                tmp_participants = this.pipeStmnt(stmnt, type, tmp_participants)
                this.newFrame(stmnt, tmp_participants)
            });
        } else if (log) console.log("No protocol found");
        
        console.log("Program created");
    }

    newFrame(stmnt : any, participants: {[id: string]: _participant}){
        let oldLast = this.last;
        this.last = {
            next: null,
            prev: oldLast,
            participants: participants,
            presentation: stmnt
        }
        if (oldLast) oldLast.next = this.last
        else this.first = this.last
    }

    getStmntType(stmnt: any) : string {
        if (stmnt.child){
            let type = stmnt.child.type
            if (type == "clearStatement") {
                return type
            } else if (type == "participantStatement" || type == "sendStatement") {
                type = type.child.type
                if (type) return type
                else throw new Error("Invalid json: participantStatement child type not found");
            } else {
                return type
            }
        }
        throw new Error("Invalid json: stmnt type not found");
    }

    pipeStmnt(stmnt:any, stmntType:string, participants: {[id: string]: _participant} | undefined){
        if (!participants) throw new Error("Invalid json: participants is undefined");

        switch (stmntType) {
            case "clearStatement":
                return this.clear(stmnt.child, participants)
            case "newStatement":
                // TODO: create methond for newStatement
            case "setStatement":
                // TODO: create methond for newStatement
            case "messageSendStatement":
                // TODO: create methond for newStatement
            case "matchStatement":
                // TODO: create methond for newStatement
            default:
                throw new Error("Invalid json: stmnt type not found");    
        }
    }

    clear(knowledge: string, participants: {[id: string]: _participant}) : {[id: string]: _participant}{
        Object.keys(participants).forEach((participant: string) => {
            participants[participant].knowledge =  participants[participant].knowledge.filter(
                                                            (item: string) => item != knowledge
                                                        )
        })
        return participants;
    }

    new(){

    }
}
