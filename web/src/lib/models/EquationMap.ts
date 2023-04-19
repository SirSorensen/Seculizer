import type { FunctionCall } from "$lang/types/parser/interfaces";
import { Equal } from "./Equal";

// This type is used to store the equalities of a function call in equations
type equalResult = {
  eqs: Equal[];
  maxDepth: number;
};

export class EquationMap {
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

  // Given a function, calculates and returns the maxDepth of the function for searching for equalities
  calcMaxDepth(f: FunctionCall): number {
    let maxDepth = 0;
    maxDepth += this.equations[f.id].maxDepth;
    for (const param of f.params) {
      if (param.type == "function" && this.equations[param.id]) {
        maxDepth += this.equations[param.id].maxDepth;
      }
    }

    return maxDepth;
  }

  // Given a function, returns the number of parameters that are not functionCalls
  functionIdParameter(f: FunctionCall): number {
    let idParams = 0;

    for (const param of f.params) {
      if (param.type === "function") idParams += this.functionIdParameter(param);
      else idParams += 1;
    }

    return idParams;
  }

  // Returns equations
  getEquations(): { [id: string]: equalResult } {
    return this.equations;
  }
}
