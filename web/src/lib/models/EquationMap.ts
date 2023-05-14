import type { FunctionCall } from "$lang/types/parser/interfaces";
import { Equation } from "./Equation";

export class EquationMap {
  private equations: { [id: string]: Equation[] } = {};
  private maxDepth = 0;

  // Adds an equality to the equation map and updates the maxDepth of the equalResult
  addEquation(left: FunctionCall, right: FunctionCall) {
    if (!this.equations[left.id]) {
      this.equations[left.id] = [];
    }
    this.equations[left.id].push(new Equation(left, right));

    this.updateMaxDepth(right);
  }

  // Update maxDepth from right of new equation
  private updateMaxDepth(right: FunctionCall) {
    // The maxDepth is the number of identifier parameters of the right function call minus 1 (atleast 1)
    let rightIdParams = this.calcTotalIdParameters(right);
    if (rightIdParams > 1) rightIdParams -= 1;
    this.maxDepth += rightIdParams;
  }

  // Update maxDepth from right of new equation
  calcMaxDepth(f: FunctionCall) {
    const totalFunctionParams = this.calcTotalFunctionParameters(f);

    return totalFunctionParams * this.maxDepth;
  }

  private calcTotalFunctionParameters(f: FunctionCall): number {
    let totalParams = 1;

    for (const param of f.params) {
      if (param.type === "function") {
        totalParams += this.calcTotalFunctionParameters(param);
      }
    }

    return totalParams;
  }

  // Given a function, returns the number of parameters that are not functionCalls
  private calcTotalIdParameters(f: FunctionCall): number {
    let idParams = 0;

    for (const param of f.params) {
      if (param.type === "function") idParams += this.calcTotalIdParameters(param);
      else idParams += 1;
    }

    return idParams;
  }

  // Returns equations
  getEquations(): { [id: string]: Equation[] } {
    return this.equations;
  }

  // Returns the maxDepth of the equation map
  getMaxDepth(): number {
    return this.maxDepth;
  }
}
