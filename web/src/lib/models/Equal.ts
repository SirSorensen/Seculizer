import type { FunctionCall, StringLiteral, NumberLiteral, Id, Type } from "$lang/types/parser/interfaces";

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
    });

    return paramIndex;
  }

  // Generate a new function call with the same parameters as the given function call, but with the parameters in the right function's call order
  generateEqual(call: FunctionCall): FunctionCall | undefined {
    // Construct the param array for the given call
    if (!this.checkIfApplicable(call, this.left)) return undefined;

    let i = 0;

    const getParam = (params: Type[], paramIndex: paramIndexType): Type => {
      if (typeof paramIndex === "number") return params[paramIndex];

      const funIndex = paramIndex[0];
      if (funIndex === undefined) throw new Error("Invalid paramIndexType");
      if (typeof funIndex !== "number") throw new Error("Invalid paramIndexType");
      if (params[funIndex].type !== "function") throw new Error("Invalid funIndex");

      const newF = paramIndex[1];
      if (newF === undefined) throw new Error("Invalid paramIndexType");

      return getParam((params[funIndex] as FunctionCall).params, newF);
    };

    // Auxiliar function to generate the new function (it works recursively if the given function contains functions)
    const aux = (newFunction: FunctionCall): FunctionCall => {
      for (let j = 0; j < newFunction.params.length; j++) {
        if (newFunction.params[j].type != "function") {
          newFunction.params[j] = getParam(call.params, this.paramIndex[i]);
          i++;
        } else {
          newFunction.params[j] = aux(newFunction.params[j] as FunctionCall);
        }
      }
      return newFunction;
    };

    // Make a clone of the right for modification in aux
    const rightClone: FunctionCall = { type: "function", id: structuredClone(this.right.id), params: structuredClone(this.right.params) };

    return aux(rightClone);
  }

  // Check if the given function call is applicable to the equation, by comparing the parameters' types and amount thereof
  checkIfApplicable(call: FunctionCall, check: FunctionCall): boolean {
    if (call.params.length != check.params.length) return false;

    for (let i = 0; i < call.params.length; i++) {
      if (check.params[i].type === "id") continue;
      if (call.params[i].type != check.params[i].type) return false;
      if (call.params[i].type === "function" && !this.checkIfApplicable(call.params[i] as FunctionCall, check.params[i] as FunctionCall))
        return false;
    }

    return true;
  }

  getLeft(): FunctionCall {
    return this.left;
  }

  getRight(): FunctionCall {
    return this.right;
  }
}
