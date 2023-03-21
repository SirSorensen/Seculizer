import type { Type } from '$lang/types/parser/interfaces';

export type _knowledge = {
    id: Type
    value: string
    encrypted : boolean
}

export class _Participant{
    private name: string
    private knowledge: _knowledge[]

    constructor(name: string, knowledge: _knowledge[] = []){
        this.name = name;
        this.knowledge = knowledge;
    }

    setKnowledge(knowledge : Type, encrypted : boolean, value : string = ""){
        let tmp_knowledge = {
                id: knowledge,
                value: value,
                encrypted: encrypted
            }

        let index = this.findKnowledgeIndex(knowledge)
        
        if (index >= 0) {
            this.knowledge[index] = tmp_knowledge
        } else {
            this.knowledge.push(tmp_knowledge)
        }
    }

    findKnowledgeIndex(element : Type) : number {
        return this.knowledge.findIndex((item) => JSON.stringify(item.id) == JSON.stringify(element))
    }

    doesKnowledgeExist(element : Type) : boolean {
        return this.findKnowledgeIndex(element) >= 0
    }

    

    clearKnowledgeElement(elem : Type) {
        this.knowledge.filter(
            (item: _knowledge) => item.id != elem
        )
    }

    getKnowledge(knowledge : Type) : _knowledge {
        let result = this.knowledge.find((item) => JSON.stringify(item.id) == JSON.stringify(knowledge))
        
        if (result === undefined) {
            console.error("Knowledge not found!")
            
            return {
                id: knowledge,
                value: "",
                encrypted: false
            }
        }
        return result
    }

        
    cloneKnowledgeList() : _knowledge[] {
        return structuredClone(this.knowledge)
    }
    
    getKnowledgeList() : _knowledge[] {
        return this.knowledge
    }

    getName() : string {
        return this.name
    }
}