import type { Equation, FunctionCall, StringLiteral, NumberLiteral, Id } from "$lang/types/parser/interfaces";
import { Equal } from './Equal';



export class EquationMap {
  equations: { [id: string]: Equal[] } = {};

  addEquation(left: FunctionCall, right: FunctionCall) {
    if (this.equations[left.id] === undefined) {
      this.equations[left.id] = [];
    }

    let equals = this.equations[left.id];
    let index = equals.findIndex((equal) => {
      return this.checkIfSame(right, equal.getRight());
    });

    if (index === -1) {
      this.equations[left.id].push(new Equal(left, right));
    }
  }

  // Returns all the equations for a given function that are applicable to it (see Equal.checkIfAplicable)
  getEquals(func: FunctionCall) {
    let equals: Equal[] = [];
    let tmp_equations: Equal[] = this.equations[func.id];

    if (tmp_equations === undefined) return equals;

    tmp_equations.forEach((equation) => {
      if (equation.checkIfAplicable(func)) {
        equals.push(equation);
      }
    });

    return equals;
  }

  // Check if two function calls are the same by comparing their names and their parameters
  checkIfSame(func1: FunctionCall, func2: FunctionCall): boolean {
    if (func1.id !== func2.id) return false;
    if (func1.params.length !== func2.params.length) return false;

    for (let i = 0; i < func1.params.length; i++) {
      if (func1.params[i].type !== func2.params[i].type) {
        return false;
      }

      if (func1.params[i].type !== "function" && func2.params[i].type !== "function") {
        if ((func1.params[i] as Id | StringLiteral | NumberLiteral).value !== (func2.params[i] as Id | StringLiteral | NumberLiteral).value) {
          return false;
        }
      } else {
        if (!this.checkIfSame(func1.params[i] as FunctionCall, func2.params[i] as FunctionCall)) {
          return false;
        }
      }
    };

    return true;
  }

  // Generates all possible equations for a function including itself
  generateEquals(func: FunctionCall): FunctionCall[] {
    let equals: Equal[] = this.getEquals(func);
    let newFuncs: FunctionCall[] = [];

    // Generate all possible equations for the function, by checking if the equals list's elements fit the form of the given function
    equals.forEach((equal) => {
      newFuncs.push(equal.generateEqual(func));
    });

    // Add original function if it is not already in the equals list
    let index = newFuncs.findIndex((equal) => {
      return this.checkIfSame(func, equal);
    });
    if (index === -1) newFuncs.push(func);

    return newFuncs;
  }

  getEquations() {
    return this.equations;
  }
}
