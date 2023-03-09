import "../../../Language/dist/dist/dts/parser/interfaces"

type _participant = {
    name: string
    icon: string
    knowledge: _knowledge[]
}

type _knowledge = {
    name: string
    icon: string
    value: string
}

type _keyRelation = {
    pk: string
    sk: string
}

export class Program {
    participants: {[id: string]: _participant} = {}
    keyRelations: {[id: string]: string} = {}

    constructor(json: any) {
        // Check if json is valid
        if (json.type != "program" ) {
            throw new Error("Invalid json")
        }

        // Participants:
        // Create participants
        this.participants = Object.assign({}, ...json.participants.map((participant:any) => ({
            [participant.name]: 
                {
                    name: participant.name,
                    icon: participant.icon,
                    knowledge: []
                }
        }
        )));

        // Add shared knowledge
        this.participants["Shared"] = {
            name: "Shared",
            icon: "",
            knowledge: []
        }

        // Knowledge:
        // Add knowledge to participants
        json.knowledge.forEach((knowledge: any) => {
            json.knowledge.children.forEach((child: any) => {
                this.participants[knowledge.id].knowledge.push({
                    name: child.name,
                    icon: child.icon,
                    value: ""
                })
            })
        })


        // KeyRelations:
        this.keyRelations = Object.assign({}, ...json.keyRelations.map((keyRelation:any) => ({
            [keyRelation.name]: keyRelation.value}
        )))

        // Add keyrelations

        
        
    }
}



