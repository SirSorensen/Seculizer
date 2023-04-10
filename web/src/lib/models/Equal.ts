import type { FunctionCall, StringLiteral, NumberLiteral, Id } from "$lang/types/parser/interfaces";

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

    call.params.forEach((param) => {
      if (param.type != "function") {
        paramArray.push(param);
      } else {
        paramArray = paramArray.concat(this.constructParamArray(param));
      }
    });

    return paramArray;
  }

  // Generate a new function call with the same parameters as the given function call, but with the parameters in the right function's call order
  generateEqual(call: FunctionCall): FunctionCall {
    // Construct the param array for the given call
    const callParamArray = this.constructParamArray(call);

    // Auxiliar function to generate the new function (it works recursively if the given function contains functions)
    const aux = (newFunction: FunctionCall, i: number): FunctionCall => {
      newFunction.params.forEach((param, index) => {
        if (param.type != "function") {
          newFunction.params[index] = callParamArray[this.paramIndex[i]];
          i++;
        } else {
          newFunction.params[index] = aux(param, i);
        }
      });
      return newFunction;
    };

    // Make a clone of the right for modification in aux
    const rightClone : FunctionCall = {id: structuredClone(this.right.id), params: structuredClone(this.right.params), type: "function"}

    return aux(rightClone, 0);
  }

  // Check if the given function call is applicable to the equation, by comparing the parameters' types and amount thereof
  checkIfAplicable(func: FunctionCall): boolean {
    if (func.params.length != this.left.params.length) return false;

    for (let i = 0; i < func.params.length; i++) {
      if (this.left.params[i].type != "id" && func.params[i].type != this.left.params[i].type) return false;
    }

    return true;
  }

  getLeft() {
    return this.left;
  }

  getRight() {
    return this.right;
  }

  checkIfInputisKnown(input: Type, participant: Participant): boolean {
    let rawKnowledge: RawParticipantKnowledge = {
      type: "rawKnowledge",
      knowledge: input,
      value: getStringFromType(input), //TODO: (suggestion) This could just be empty string
    };

    if (participant.doesKnowledgeExist(rawKnowledge)) return true;

    if (input.type === "function") {
      input.params.forEach((param) => {
        if (this.checkIfInputisKnown(param, participant)) return true;
      });
    }

    return false;
  }
}
