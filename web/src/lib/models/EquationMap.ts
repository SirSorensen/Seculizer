import type { Equation, FunctionCall, StringLiteral, NumberLiteral, Id } from "$lang/types/parser/interfaces";

type equation = [FunctionCall, FunctionCall];

export class EquationMap {
  equations: { [id: string]: equation[] } = {};

  addEquation(eq: Equation) {
    if (this.equations[eq.left.id] === undefined) {
      this.equations[eq.left.id] = [];
    }
    if (this.equations[eq.right.id] === undefined) {
      this.equations[eq.right.id] = [];
    }

    this.equations[eq.left.id].push([eq.left, eq.right]);
    this.equations[eq.right.id].push([eq.right, eq.left]);
  }

  getEquals(func: FunctionCall) {
    let equals: FunctionCall[] = [];
    let tmp_equations = this.equations[func.id];

    if (tmp_equations === undefined) return equals;

    tmp_equations.forEach((equation) => {
      if (this.checkIfAplicable(func, equation[0])) {
        equals.push(equation[1]);
      }
    });

    return equals;
  }

  checkIfAplicable(func: FunctionCall, eq: FunctionCall) {
    if (func.params.length != eq.params.length) return false;

    for (let i = 0; i < func.params.length; i++) {
      if (func.params[i].type != eq.params[i].type) return false;
    }

    return true;
  }

  reformatFunctionCall(func: FunctionCall, eq: equation) {
    let newFunc: FunctionCall = {
      type: "function",
      id: func.id,
      params: [],
    };

    let indexArray: number[] = [];

    for (let i = 0; i < eq[0].params.length; i++) {
      let eq0_param = eq[0].params[i];
      let func_param = func.params[i];

      for (let j = 0; j < eq[1].params.length; j++) {
        let eq1_param = eq[1].params[j];

        if (
          eq0_param.type == eq1_param.type &&
          eq0_param.type != "function" &&
          func_param.type != "function" &&
          eq0_param.value == func_param.value &&
          !indexArray.includes(j)
        ) {
          indexArray.push(j);
          break;
        }
      }
    }

    return newFunc;
  }
}
