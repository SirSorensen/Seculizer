import type { FunctionCall, StringLiteral, NumberLiteral, Id, Type } from "$lang/types/parser/interfaces";
import type { Participant } from "./Participant";

export class Equal {
  // exp(exp(A,B),C) = exp(exp(A,C),B)

  private right: FunctionCall;
  private left: FunctionCall;

  // The index of the parameters of the right function call in the left function call (i.e. exp(A,B) => exp(B,A) -> [1, 0])
  private paramIndex: number[] = [];

  constructor(left: FunctionCall, right: FunctionCall) {
    this.right = right;
    this.left = left;

    const leftParams = this.constructParamArray(left);
    const rightParams = this.constructParamArray(right);

    // See paramIndex description
    this.paramIndex = rightParams.map((rightParam) => {
      return leftParams.findIndex((leftParam) => {
        return leftParam.value == rightParam.value;
      });
    });
  }

  // Construct an array of the parameters of the given function call (i.e. exp(A,B) -> [0, 1])
  constructParamArray(call: FunctionCall): (Id | StringLiteral | NumberLiteral)[] {
    let paramArray: (Id | StringLiteral | NumberLiteral)[] = [];
    for (const param of call.params) {
      if (param.type != "function") {
        paramArray.push(param);
      } else {
        paramArray = paramArray.concat(this.constructParamArray(param));
      }
    }

    return paramArray;
  }

  // Generate a new function call with the same parameters as the given function call, but with the parameters in the right function's call order
  generateEqual(call: FunctionCall): FunctionCall {
    // Construct the param array for the given call
    const callParamArray = this.constructParamArray(call);

    let i = 0;

    // Auxiliar function to generate the new function (it works recursively if the given function contains functions)
    const aux = (newFunction: FunctionCall): FunctionCall => {
      newFunction.params.forEach((param, index) => {
        if (param.type != "function") {
          newFunction.params[index] = callParamArray[this.paramIndex[i]];
          i++;
        } else {
          newFunction.params[index] = aux(param);
        }
      });
      return newFunction;
    };

    // Make a clone of the right for modification in aux
    const rightClone: FunctionCall = { type: "function", id: structuredClone(this.right.id), params: structuredClone(this.right.params) };

    return aux(rightClone);
  }

  // Check if the given function call is applicable to the equation, by comparing the parameters' types and amount thereof
  checkIfApplicable(func: FunctionCall): boolean {
    if (func.params.length != this.left.params.length) return false;

    for (let i = 0; i < func.params.length; i++) {
      if (this.left.params[i].type != "id" && func.params[i].type != this.left.params[i].type) return false;
    }

    return true;
  }

  getLeft():FunctionCall {
    return this.left;
  }

  getRight():FunctionCall {
    return this.right;
  }

  static checkIfInputisKnown(input: Type, participant: Participant, val: Type | undefined = undefined): boolean {
    if (participant.doesTypeAndValueExist(input, val)) return true;

    if (input.type === "function" && val == undefined) {
      for(const param of input.params) {
        if (!Equal.checkIfInputisKnown(param, participant)) return false;
      }
      return true;
    }
    return false;
  }
}
