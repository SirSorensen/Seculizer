import type { FunctionCall, Id, Type } from "$lang/types/parser/interfaces";
import type { Participant } from "./Participant";
import { Equal } from "./Equal";
import { getStringFromType } from "$lib/utils/stringUtil";

// This type is used to store the equalities of a function call in equations
type equalResult = {
  eqs: Equal[];
  maxDepth: number;
};

// This type is used to store the function calls that are currently being searched for in the doesParticipantKnow function
type queueElement = {
  f: FunctionCall;
  searchDepth: number;
  paramDepth: number[];
};

export class EquationMap {
  private opaqueFunctions: string[] = [];
  private equations: { [id: string]: equalResult } = {};

  // Adds an equality to the equation map and updates the maxDepth of the equalResult
  addEquation(left: FunctionCall, right: FunctionCall) {
    if (!this.equations[left.id]) {
      this.equations[left.id] = { eqs: [], maxDepth: 0 };
    }
    this.equations[left.id].eqs.push(new Equal(left, right));
    this.equations[left.id].maxDepth += this.functionIdParameter(right);
    if (this.equations[left.id].maxDepth > 1) this.equations[left.id].maxDepth -= 1;
  }

  addOpaqueFunction(id: string) {
    if (!this.opaqueFunctions.includes(id)) this.opaqueFunctions.push(id);
  }

  getOpaqueFunctions(): string[] {
    return this.opaqueFunctions;
  }

  // Returns whether a participant knows a function call (i.e. whether the participant knows the function call or any of its equalities)
  doesParticipantKnow(parti: Participant, f: FunctionCall, val: Type | undefined): boolean {
    const history: Map<string, boolean> = new Map();
    const queue: queueElement[] = [];
    if (!this.equations[f.id]) return Equal.checkIfInputisKnown(f, parti, this.opaqueFunctions, val);
    const maxDepth = this.calcMaxDepth(f);

    queue.push({ f: f, searchDepth: 0, paramDepth: [] });

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) continue;
      if (current.searchDepth > maxDepth) continue;

      const _f = current.f;
      if (history.has(getStringFromType(_f))) continue;
      history.set(getStringFromType(_f), true);

      if (Equal.checkIfInputisKnown(_f, parti, this.opaqueFunctions, val)) return true;

      
      if (this.equations[_f.id])
        for (const eq of this.equations[_f.id].eqs) {
          const _fEq = eq.generateEqual(_f);
          if (_fEq === undefined) continue
          queue.push({ f: _fEq, searchDepth: current.searchDepth + 1, paramDepth: current.paramDepth });
        }

      // Enqueue inner functions
      const tmpParamDepth = this.calcParamDepth(_f, current.paramDepth);

      while (tmpParamDepth.length > 0) {
        const tmpDepth = tmpParamDepth.shift();
        if (tmpDepth === undefined) continue;
        
        const _paramDepth = current.paramDepth.concat(tmpDepth);
        const _fParam = this.getParamFunctionFromDepth(_f, _paramDepth);

        if (this.equations[_fParam.id])
          for (const _fParamEq of this.equations[_fParam.id].eqs) {
            const _fParamGenEq = _fParamEq.generateEqual(_fParam);
            if (_fParamGenEq === undefined) continue

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

  // Given a function, calculates and returns the maxDepth of the function for searching for equalities
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

  // Given a function and a paramDepth, returns the index of the next inner functions
  // For example if f = f(a, g(b, c), e) and paramDepth = [], it returns [1]
  // For example if f = f(a, g(h(b, c), k(d, e)), f) and paramDepth = [1], it returns [0, 1]
  // For example if f = f(a, b) and paramDepth = [], it returns []
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

  // Given a function and a paramDepth, returns the inner function from the paramDepth
  // For example if f = f(a, g(b, c), e) and paramDepth = [], it returns f
  // For example if f = f(a, g(h(b, c), k(d, e)), f) and paramDepth = [1], it returns g
  private getParamFunctionFromDepth(f: FunctionCall, paramDepth: number[]): FunctionCall {
    let _f: FunctionCall = f;
    for (const depth of paramDepth) {
      if (!_f.params[depth] || _f.params[depth].type != "function") throw new Error("paramDepth is not correct " + getStringFromType(_f.params[depth]));
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

  // Given a function, returns the number of parameters that are not functionCalls
  private functionIdParameter(f: FunctionCall): number {
    let idParams = 0;

    for (const param of f.params) {
      if (param.type === "function") idParams += this.functionIdParameter(param);
      else idParams += 1;
    }

    return idParams;
  }

  // Returns equations
  getEquations() {
    return this.equations;
  }
}
