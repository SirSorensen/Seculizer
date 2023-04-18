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
  param_depth: number[];
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
    const history: Map<string, boolean> = new Map();
    const queue: queueElement[] = [];
    if (this.equations[f.id] === undefined) return Equal.checkIfInputisKnown(f, parti);
    const maxDepth = this.calcMaxDepth(f);
    
    queue.push({ f: f, search_depth: 0, param_depth: []});

    //TODO: generateEquals for inner functions
    while (queue.length > 0) {
      const current = queue.shift();
      if (current === undefined) continue;
      if (current.search_depth > maxDepth) continue;

      const _f = current.f
      if (history.has(getStringFromType(_f))) continue;
      history.set(getStringFromType(_f), true);

      if (Equal.checkIfInputisKnown(_f, parti)) return true;

      for (const eq of this.equations[_f.id].eqs) {
        const _fEq = eq.generateEqual(_f);
        queue.push({ f: _fEq, search_depth: current.search_depth + 1, param_depth: current.param_depth });
      }

      const tmpParam_depth = this.calcParamDepth(_f, current.param_depth);
      while (tmpParam_depth.length > 0) {
        for (const eq of this.equations[_f.id].eqs) {
          const _fParamEq = eq.generateEqual(this.getParamFunctionFromDepth(_f, current.param_depth));

          queue.push({
            f: this.cloneFunctionChangedParam(_f, current.param_depth, _fParamEq),
            search_depth: current.search_depth + 1,
            param_depth: current.param_depth.concat([tmpParam_depth.shift() as number]),
          });
        }
      }
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

  private calcParamDepth(f: FunctionCall, param_depth : number[]): number[] {
    // Arrange variables
    const _f: FunctionCall = this.getParamFunctionFromDepth(f, param_depth);
    const index: number[] = [];

    //Build index
    for(let i = 0; i < _f.params.length; i++){
      if(_f.params[i].type == "function") index.push(i);
    }

    return index
  }

  private getParamFunctionFromDepth(f: FunctionCall, param_depth : number[]): FunctionCall {
    let _f: FunctionCall = f;
    const index = param_depth.map((x) => x);

    while (index.length > 0) {
      const i = index.shift();
      if (i === undefined) throw new Error("param_depth is not defined correctly");
      if (_f.params[i] === undefined || _f.params[i].type != "function") throw new Error("param_depth is not correct");
      _f = _f.params[i] as FunctionCall;
    }

    return _f;
  }

  cloneFunctionChangedParam(f: FunctionCall, param_depth: number[], newParam: FunctionCall): FunctionCall {
    const _f = structuredClone(f);
    const _param_depth = param_depth.map((x) => x);

    const aux = (aux_f: FunctionCall) => {
      // If _param_depth is empty, we are at the function we want to change
      if (_param_depth.length === 0) return newParam;

      // Get the index of the next function
      const i = _param_depth.shift();
      
      //Check if i and aux_f.params[i] are valid
      if (i === undefined) throw new Error("param_depth is not defined correctly");
      if (aux_f.params[i] === undefined || aux_f.params[i].type != "function") throw new Error("param_depth is not correct");

      // Call aux with the next function and change the param[i]
      aux_f.params[i] = aux(aux_f.params[i] as FunctionCall);
      return aux_f
    };

    return aux(_f);
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
