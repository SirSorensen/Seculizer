import type { FunctionCall, StringLiteral, NumberLiteral, Id, Type } from "$lang/types/parser/interfaces";
import type { ParticipantKnowledge, RawParticipantKnowledge } from "src/types/participant";
import { Equal } from "./Equal";
import type { Participant } from "./Participant";
import { getStringFromType } from "$lib/utils/stringUtil";

type equalResult = {
  eqs: Equal[];
  maxDepth: number;
};

type queueElement = {
  f: FunctionCall;
  search_depth: number;
  param_depth: number;
};

export class EquationMap {
  private equations: { [id: string]: equalResult } = {};

  addEquation(left: FunctionCall, right: FunctionCall) {
    if (this.equations[left.id] === undefined) {
      this.equations[left.id] = { eqs: [], maxDepth: 0 };
    }
    this.equations[left.id].eqs.push(new Equal(left, right));
    this.equations[left.id].maxDepth += this.functionIdParameter(right);
  }

  doesParticipantKnow(parti: Participant, f: FunctionCall, val: Type | undefined = undefined): boolean {
    let history: Map<string, boolean> = new Map();
    let queue: queueElement[] = [];
    if (this.equations[f.id] === undefined) return Equal.checkIfInputisKnown(f, parti);
    let maxDepth = this.calcMaxDepth(f);
    
    queue.push({ f: f, search_depth: 0, param_depth: 0});

    //TODO: generateEquals for inner functions
    while (queue.length > 0) {
      let current = queue.shift();
      if (current === undefined) continue;
      if (current.search_depth > maxDepth) continue;

      let _f = current.f
      if (history.has(getStringFromType(_f))) continue;
      history.set(getStringFromType(_f), true);

      if (Equal.checkIfInputisKnown(_f, parti)) return true;

      for (const eq of this.equations[_f.id].eqs) {
        let _fEq = eq.generateEqual(_f);
        queue.push({ f: _fEq, search_depth: current.search_depth + 1, param_depth: current.param_depth });
      }

      let param_depth = this.calcParamDepth(_f, current.param_depth);
      if (param_depth !== undefined) {
        maxDepth += this.equations[(f.params[param_depth - 1] as FunctionCall).id].maxDepth;
        queue.push({ f: _f, search_depth: current.search_depth + 1, param_depth: current.param_depth + 1 });
      };
    }

    return false;
  }

  private calcMaxDepth(f: FunctionCall) : number {
    let maxDepth = 0;
    maxDepth += this.equations[f.id].maxDepth;
    for (const param of f.params) {
      if (param.type == "function" && this.equations[param.id] !== undefined) {
        maxDepth += this.equations[param.id].maxDepth;
      }
    }

    return maxDepth;
  }

  private calcParamDepth(f: FunctionCall, param_depth : number, i : number = 0): number | undefined {

    const aux = (_f : FunctionCall) => {
        for (const param of f.params) {
        i += 1;
        if (param.type == "function"){ 
          if (i > param_depth) return i;
          else aux(param)
        }
      }

      return undefined;
    }

    aux(f);
    return i;
  }

  private functionIdParameter(f: FunctionCall): number {
    let idParams = 0;

    f.params.forEach((t) => {
      if (t.type == "function") idParams += this.functionIdParameter(t);
      else idParams += 1;
    });

    return idParams;
  }

  getEquations(){
    return this.equations;
  }
}
