import type { FunctionCall, StringLiteral, NumberLiteral, Id, Type } from "$lang/types/parser/interfaces";
import type { Participant } from "./Participant";

type rightParamType = StringLiteral | NumberLiteral | Id;
type leftParamType = rightParamType | leftParamType[];
type paramIndexType = number | paramIndexType[];

export class Equal {
  // exp(exp(A,B),C) = exp(exp(A,C),B)

  private right: FunctionCall;
  private left: FunctionCall;

  // The index of the parameters of the right function call in the left function call
  //(i.e. exp(A,B) => exp(B,A) -> [1, 0]
  // or foo(lee(A,B),C) => foo(A,B) -> [[0,0],1]
  //or foo(A,B) => foo(lee(A,B),B) -> [0,1,1] )

  private paramIndex: paramIndexType[] = [];

  constructor(left: FunctionCall, right: FunctionCall) {
    this.right = right;
    this.left = left;

    const leftParams = this.constructLeftParamArray(left);
    const rightParams = this.constructRightParamArray(right);

    // See paramIndex description
    this.paramIndex = this.constructParamIndex(leftParams, rightParams);
  }

  // Construct an array of the parameters of the given function call (i.e. exp(A,B) -> [A, B] and foo(lee(A,B),C) -> [ [A, B] , C])
  constructLeftParamArray(f: FunctionCall): leftParamType[] {
    const paramArray: leftParamType[] = [];

    //Build index
    for (const param of f.params) {
      if (param.type !== "function") paramArray.push(param);
      else paramArray.push(this.constructLeftParamArray(param));
    }

    return paramArray;
  }

  constructRightParamArray(f: FunctionCall): rightParamType[] {
    let paramArray: rightParamType[] = [];

    for (const param of f.params) {
      if (param.type != "function") {
        paramArray.push(param);
      } else {
        paramArray = paramArray.concat(this.constructRightParamArray(param));
      }
    }

    return paramArray;
  }

  private constructCallParamArray(call: FunctionCall): Type[] {
    const paramArray: Type[] = [];

    for (const param of call.params) {
      continue;
    }

    return paramArray;
  }

  constructParamIndex(leftParams: leftParamType[], rightParams: rightParamType[]): paramIndexType[] {
    let paramIndex: paramIndexType[] = [];

    const findIndex = (leftSubParam: leftParamType[], rightParam: rightParamType): paramIndexType => {
      
      const index = leftSubParam.findIndex((leftParam) => {
        if (!Array.isArray(leftParam)) return leftParam.value === rightParam.value;
      });

      if (index === -1) {
        for (let i = 0; i < leftSubParam.length; i++) {
          if (Array.isArray(leftSubParam[i])) {
            const subIndex = findIndex(leftSubParam[i] as leftParamType[], rightParam);
            
            if (subIndex !== -1) {
              return [i, subIndex];
            }
          }
        }
      }

      return index;
    };

    paramIndex = rightParams.map((rightParam) => {
      return findIndex(leftParams, rightParam);
    })

    return paramIndex;
  }

  // Generate a new function call with the same parameters as the given function call, but with the parameters in the right function's call order
  generateEqual(call: FunctionCall): FunctionCall {
    // Construct the param array for the given call
    const callParamArray = this.constructLeftParamArray(call);
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

  getLeft(): FunctionCall {
    return this.left;
  }

  getRight(): FunctionCall {
    return this.right;
  }

  static checkIfInputisKnown(input: Type, participant: Participant, val: Type | undefined = undefined): boolean {
    if (participant.doesTypeAndValueExist(input, val)) return true;

    if (input.type === "function" && val == undefined) {
      for (const param of input.params) {
        if (!Equal.checkIfInputisKnown(param, participant)) return false;
      }
      return true;
    }
    return false;
  }
}
