import type { FunctionCall, Type } from "$lang/types/parser/interfaces";
import type { Participant } from "./Participant";
import { Equal } from "./Equal";
import { getStringFromType } from "$lib/utils/stringUtil";

type equalResult = {
  eqs: Equal[];
  maxDepth: number;
};

type queueElement = {
  f: FunctionCall;
  searchDepth: number;
  paramDepth: number[];
};

export class EquationMap {
  private equations: { [id: string]: equalResult } = {};

  addEquation(left: FunctionCall, right: FunctionCall) {
    if (!this.equations[left.id]) {
      this.equations[left.id] = { eqs: [], maxDepth: 0 };
    }
    this.equations[left.id].eqs.push(new Equal(left, right));
    this.equations[left.id].maxDepth += this.functionIdParameter(right);
  }

  doesParticipantKnow(parti: Participant, f: FunctionCall, val: Type | undefined = undefined): boolean {
    const history: Map<string, boolean> = new Map();
    const queue: queueElement[] = [];
    if (!this.equations[f.id]) return Equal.checkIfInputisKnown(f, parti);
    const maxDepth = this.calcMaxDepth(f);

    queue.push({ f: f, searchDepth: 0, paramDepth: [] });

    //TODO: generateEquals for inner functions
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) continue;
      if (current.searchDepth > maxDepth) continue;

      const _f = current.f;
      if (history.has(getStringFromType(_f))) continue;
      history.set(getStringFromType(_f), true);

      if (Equal.checkIfInputisKnown(_f, parti)) return true;

      for (const eq of this.equations[_f.id].eqs) {
        const _fEq = eq.generateEqual(_f);
        queue.push({ f: _fEq, searchDepth: current.searchDepth + 1, paramDepth: current.paramDepth });
      }

      const tmpParamDepth = this.calcParamDepth(_f, current.paramDepth);
      
      while (tmpParamDepth.length > 0) {
        for (const eq of this.equations[_f.id].eqs) {
          const _fParamEq = eq.generateEqual(this.getParamFunctionFromDepth(_f, current.paramDepth));

          queue.push({
            f: this.cloneFunctionChangedParam(_f, current.paramDepth, _fParamEq),
            searchDepth: current.searchDepth + 1,
            paramDepth: current.paramDepth.concat([tmpParamDepth.shift() as number]),
          });
        }
      }
    }

    return false;
  }

  private calcMaxDepth(f: FunctionCall): number {
    let maxDepth = 0;
    maxDepth += this.equations[f.id].maxDepth;
    for (const param of f.params) {
      if (param.type == "function" && this.equations[param.id]) {
        maxDepth += this.equations[param.id].maxDepth;
      }
    }

    return maxDepth;
  }

  private calcParamDepth(f: FunctionCall, paramDepth: number[]): number[] {
    // Arrange variables
    const _f: FunctionCall = this.getParamFunctionFromDepth(f, paramDepth);
    const index: number[] = [];

    //Build index
    for (let i = 0; i < _f.params.length; i++) {
      if (_f.params[i].type == "function") index.push(i);
    }

    return index;
  }

  private getParamFunctionFromDepth(f: FunctionCall, paramDepth: number[]): FunctionCall {
    let _f: FunctionCall = f;
    for (const depth of paramDepth) {
      if (!_f.params[depth] || _f.params[depth].type != "function") throw new Error("paramDepth is not correct");
      _f = _f.params[depth] as FunctionCall;
    }
    return _f;
  }

  cloneFunctionChangedParam(f: FunctionCall, paramDepth: number[], newParam: FunctionCall): FunctionCall {
    const _f: FunctionCall = { type: "function", id: structuredClone(f.id), params: structuredClone(f.params) };
    const _paramDepth = paramDepth.map((x) => x);

    const aux = (aux_f: FunctionCall) => {
      // If _paramDepth is empty, we are at the function we want to change
      if (_paramDepth.length === 0) return newParam;

      // Get the index of the next function
      const i = _paramDepth.shift();

      //Check if i and aux_f.params[i] are valid
      if (!i) throw new Error("paramDepth is not defined correctly");
      if (!aux_f.params[i] || aux_f.params[i].type != "function") throw new Error("paramDepth is not correct");

      // Call aux with the next function and change the param[i]
      aux_f.params[i] = aux(aux_f.params[i] as FunctionCall);
      return aux_f;
    };

    return aux(_f);
  }

  private functionIdParameter(f: FunctionCall): number {
    let idParams = 0;

    for (const t of f.params) {
      if (t.type == "function") idParams += this.functionIdParameter(t);
      else idParams += 1;
    }

    if (idParams > 1) return idParams - 1;
    else return idParams;
  }

  getEquations() {
    return this.equations;
  }
}
