import type { FunctionCall, Type } from "$lang/types/parser/interfaces";
import { getStringFromType } from "$lib/utils/stringUtil";
import type { ParticipantKnowledge } from "src/types/participant";
import { EquationMap } from "./EquationMap";
import { Participant } from "./Participant";
import type { ParticipantMap } from "./ParticipantMap";

// This type is used to store the function calls that are currently being searched for in the isFunctionKnown function
type queueElement = {
  f: FunctionCall;
  searchDepth: number;
  paramDepth: number[];
};

export class KnowledgeHandler {
  equations: EquationMap = new EquationMap();
  private opaqueFunctions: string[] = [];

  getEquations(): EquationMap {
    return this.equations;
  }

  addOpaqueFunction(id: string) {
    if (!this.opaqueFunctions.includes(id)) this.opaqueFunctions.push(id);
  }

  getOpaqueFunctions(): string[] {
    return this.opaqueFunctions;
  }

  checkIfInputisKnown(input: Type, participant: Participant, opaqueFunctions: string[], val: Type | undefined = undefined): boolean {
    if (this.isTypeAndValueKnown(participant, input, val)) return true;

    if (input.type === "function" && val == undefined && !opaqueFunctions.includes((input as FunctionCall).id)) {
      for (const param of input.params) {
        if (!this.checkIfInputisKnown(param, participant, opaqueFunctions)) return false;
      }
      return true;
    }
    return false;
  }

  // Checks if the participant knows the given function call
  isTypeAndValueKnown(parti : Participant, type: Type, val: Type | undefined): boolean {
    // Construct a temporary knowledge object from the given parameter 'type' and 'value'
    const tmpKnowledge : ParticipantKnowledge = {
      type: "rawKnowledge",
      knowledge: type,
      value: val,
    }

    // Get the list of knowledges from the participant
    const partiKnowledge = parti.getKnowledgeList();

    // Check if the temporary knowledge object is in the list of knowledges
    return partiKnowledge.some((knowledge) => {
      return this.isKnowledgeEqual(knowledge.item, tmpKnowledge, true)
    });
  }

  static compareKnowledge(knowledgeA: ParticipantKnowledge, knowledgeB: ParticipantKnowledge, strict = false): boolean {
    if (knowledgeA.type === "rawKnowledge" && knowledgeB.type === "rawKnowledge") {
      return (
        JSON.stringify(knowledgeA.knowledge) === JSON.stringify(knowledgeB.knowledge) && // check if knowledge is the same
        (!strict || JSON.stringify(knowledgeA.value) === JSON.stringify(knowledgeB.value)) // if strict is true, then we need to check the value as well
      );
    } else if (knowledgeA.type === "encryptedKnowledge" && knowledgeB.type === "encryptedKnowledge") {
      if (JSON.stringify(knowledgeA.encryption) !== JSON.stringify(knowledgeB.encryption)) return false;
      if (knowledgeA.knowledge.length !== knowledgeB.knowledge.length) return false;
      const tmp = structuredClone(knowledgeB.knowledge);
      for (let i = 0; i < knowledgeA.knowledge.length; i++) {
        const knowledge = knowledgeA.knowledge[i];
        const index = tmp.findIndex((item) => this.compareKnowledge(item, knowledge));
        if (index < 0) return false;
        tmp.splice(index, 1);
      }
      return tmp.length === 0;
    }
    return false;
  }

  isKnowledgeEqual(knowledgeA: ParticipantKnowledge, knowledgeB: ParticipantKnowledge, strict = false): boolean {
    if (knowledgeA.type === "rawKnowledge" && knowledgeB.type === "rawKnowledge") {
      const isKnowledgeSame = JSON.stringify(knowledgeA.knowledge) === JSON.stringify(knowledgeB.knowledge);
      if (!isKnowledgeSame) return false;

      if (strict) {
        // If either are undefined check if both are undefined
        if (!knowledgeA.value || !knowledgeB.value) return !knowledgeB.value && !knowledgeA.value;

        // If the types are different, return false
        if (knowledgeA.value.type !== knowledgeB.value.type) return false;

        // If the types are the same, check if the values are the same, and if they are, return true
        if (JSON.stringify(knowledgeA.value) === JSON.stringify(knowledgeB.value)) return true;

        // If the values aren't the same, but they are functions, check equalities
        if (knowledgeA.value.type === "function") {
          // If the values are different, but the values are functions, then we need to check if the functions are equal
          const tmpKnowledge: ParticipantKnowledge = {
            type: "rawKnowledge",
            knowledge: knowledgeA.value,
          };
          const tmpParti = new Participant("tmpParti");
          tmpParti.setKnowledge(tmpKnowledge);

          return this.isFunctionKnown(tmpParti, knowledgeB.knowledge as FunctionCall, knowledgeB.value);
        }
        
        // If the values aren't the same, and they aren't functions 
        // (and therefore have no equalities), then return false
        return false;

      } else {
        // If strict is false, then we don't need to check the value,
        // and we have already checked if the knowledges are not the same,
        // therefore return true
        return true;
      }
      //   return (
      //     JSON.stringify(knowledgeA.knowledge) === JSON.stringify(knowledgeB.knowledge) && // check if knowledge is the same
      //     (!strict || JSON.stringify(knowledgeA.value) === JSON.stringify(knowledgeB.value)) // if strict is true, then we need to check the value as well
      //   );
    } else if (knowledgeA.type === "encryptedKnowledge" && knowledgeB.type === "encryptedKnowledge") {
      if (JSON.stringify(knowledgeA.encryption) !== JSON.stringify(knowledgeB.encryption)) return false;
      if (knowledgeA.knowledge.length !== knowledgeB.knowledge.length) return false;
      const tmp = structuredClone(knowledgeB.knowledge);
      for (let i = 0; i < knowledgeA.knowledge.length; i++) {
        const knowledge = knowledgeA.knowledge[i];
        const index = tmp.findIndex((item) => this.isKnowledgeEqual(item, knowledge));
        if (index < 0) return false;
        tmp.splice(index, 1);
      }
      return tmp.length === 0;
    }
    return false;
  }

  // Returns whether a participant knows a function call (i.e. whether the participant knows the function call or any of its equalities)
  isFunctionKnown(parti: Participant, f: FunctionCall, val: Type | undefined): boolean {
    const history: Map<string, boolean> = new Map();
    const queue: queueElement[] = [];
    if (!this.equations.getEquations()[f.id]) return this.checkIfInputisKnown(f, parti, this.opaqueFunctions, val);
    const maxDepth = this.equations.calcMaxDepth(f);

    queue.push({ f: f, searchDepth: 0, paramDepth: [] });

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) continue;
      if (current.searchDepth > maxDepth) continue;

      const _f = current.f;
      if (history.has(getStringFromType(_f))) continue;
      history.set(getStringFromType(_f), true);

      if (this.checkIfInputisKnown(_f, parti, this.opaqueFunctions, val)) return true;

      if (this.equations.getEquations()[_f.id])
        for (const eq of this.equations.getEquations()[_f.id].eqs) {
          const _fEq = eq.generateEqual(_f);
          if (_fEq === undefined) continue;
          queue.push({ f: _fEq, searchDepth: current.searchDepth + 1, paramDepth: current.paramDepth });
        }

      // Enqueue inner functions
      const tmpParamDepth = this.calcParamDepth(_f, current.paramDepth);

      while (tmpParamDepth.length > 0) {
        const tmpDepth = tmpParamDepth.shift();
        if (tmpDepth === undefined) continue;

        const _paramDepth = current.paramDepth.concat(tmpDepth);
        const _fParam = this.getParamFunctionFromDepth(_f, _paramDepth);

        if (this.equations.getEquations()[_fParam.id])
          for (const _fParamEq of this.equations.getEquations()[_fParam.id].eqs) {
            const _fParamGenEq = _fParamEq.generateEqual(_fParam);
            if (_fParamGenEq === undefined) continue;

            queue.push({
              f: this.cloneFunctionChangedParam(_f, _paramDepth, _fParamGenEq),
              searchDepth: current.searchDepth + 1,
              paramDepth: _paramDepth,
            });
          }
      }
    }

    return false;
  }

  doesParticipantKnow(parti : Participant, type : Type) : boolean {
    const value = parti.getValueOfKnowledge(type);

    if (type.type != "function") return this.isTypeAndValueKnown(parti, type, value);
    else return this.isFunctionKnown(parti, type, value);
  }

  // Given a function and a paramDepth, returns the index of the next inner functions
  // For example if f = f(a, g(b, c), e) and paramDepth = [], it returns [1]
  // For example if f = f(a, g(h(b, c), k(d, e)), f) and paramDepth = [1], it returns [0, 1]
  // For example if f = f(a, b) and paramDepth = [], it returns []
  calcParamDepth(f: FunctionCall, paramDepth: number[]): number[] {
    // Arrange variables
    const _f: FunctionCall = this.getParamFunctionFromDepth(f, paramDepth);
    const index: number[] = [];

    //Build index
    for (let i = 0; i < _f.params.length; i++) {
      if (_f.params[i].type == "function") index.push(i);
    }

    return index;
  }

  // Given a function and a paramDepth, returns the inner function from the paramDepth
  // For example if f = f(a, g(b, c), e) and paramDepth = [], it returns f
  // For example if f = f(a, g(h(b, c), k(d, e)), f) and paramDepth = [1], it returns g
  getParamFunctionFromDepth(f: FunctionCall, paramDepth: number[]): FunctionCall {
    let _f: FunctionCall = f;
    for (const depth of paramDepth) {
      if (!_f.params[depth] || _f.params[depth].type != "function")
        throw new Error("paramDepth is not correct " + getStringFromType(_f.params[depth]));
      _f = _f.params[depth] as FunctionCall;
    }
    return _f;
  }

  // Given a function, a paramDepth and a new parameter-function, returns a new function with the new parameter-function in the paramDepth
  // For example if f = f(a, g(b, c), d), paramDepth = [1], and newParam = h(e, f), it returns f(a, h(e, f), d)
  cloneFunctionChangedParam(f: FunctionCall, paramDepth: number[], newParam: FunctionCall): FunctionCall {
    const _f: FunctionCall = { type: "function", id: structuredClone(f.id), params: structuredClone(f.params) };
    const paramDepthClone = paramDepth.concat(); // Clone paramDepth

    const aux = (aux_f: FunctionCall) => {
      // If _paramDepth is empty, we are at the function we want to change
      if (paramDepthClone.length === 0) return newParam;

      // Get the index of the next function
      const i = paramDepthClone.shift();

      //Check if i and aux_f.params[i] are valid
      if (i === undefined) throw new Error("paramDepth is not defined correctly");
      if (!aux_f.params[i] || aux_f.params[i].type != "function") throw new Error("paramDepth is not correct");

      // Call aux with the next function and change the param[i]
      aux_f.params[i] = aux(aux_f.params[i] as FunctionCall);
      return aux_f;
    };

    return aux(_f);
  }

  transferKnowledge(partiMap: ParticipantMap, senderId: string, receiverId: string, knowledge: ParticipantKnowledge) {
    // Error handling
    if (senderId == receiverId) throw new Error("Sender and receiver cannot be the same! You cannot send something to yourself!");
    const sender = partiMap.getParticipant(senderId);
    const receiver = partiMap.getParticipant(receiverId);
    if (!sender) throw new Error("Sender not found!");
    if (!receiver) throw new Error("Receiver not found!");

    if (this.isSimpleKnowledge(knowledge)) return;
    const tmp_knowledge = sender.getKnowledge(knowledge);
    if (tmp_knowledge) receiver.setKnowledge(tmp_knowledge);
    else {
      console.error("Knowledge not found!", partiMap.getParticipant(senderId).getName(), knowledge);
      receiver.setKnowledge(knowledge);
    }
  }

  isSimpleKnowledge(knowledge: ParticipantKnowledge): boolean {
    if (knowledge.type === "rawKnowledge") {
      return knowledge.knowledge.type == "string" || knowledge.knowledge.type == "number";
    }
    return knowledge.knowledge.every((item) => this.isSimpleKnowledge(item));
  }
}