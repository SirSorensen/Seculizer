import type { Equation, FunctionCall, StringLiteral, NumberLiteral, Id, Type } from "$lang/types/parser/interfaces";
import { LatexMap } from './LatexMap';

export class Equal {
  // exp(exp(A,B),C) = exp(exp(A,C),B)

  right: FunctionCall
  paramIndex : number[] = [];

  constructor(left: FunctionCall, right: FunctionCall) {
    this.right = right

    let leftParams = this.constructParamArray(left);
    let rightParams = this.constructParamArray(right);

    //[0, 2, 1]
    this.paramIndex = rightParams.map((rightParam) => {
      return leftParams.findIndex((leftParam) => {
        return leftParam.value == rightParam.value;
      }) 
    });


  }

  constructParamArray(call: FunctionCall): (Id | StringLiteral | NumberLiteral)[] {
    let paramArray: (Id | StringLiteral | NumberLiteral)[] = [];

    call.params.forEach((param, index) => {
      if (param.type != "function") {
        paramArray.push(param);
      } else {
        paramArray = paramArray.concat(this.constructParamArray(param));
      }
    });

    return paramArray;
  }

  generateEqual(call : FunctionCall) : FunctionCall{ 
    //TODO: Make clone!!
    let callParamArray = this.constructParamArray(call);

    const aux = (newFunction: FunctionCall, i: number) : FunctionCall => {
      newFunction.params.forEach((param, index) => {
        if (param.type != "function") {
            newFunction.params[index] = callParamArray[this.paramIndex[i]];
            i++;
        } else {
            newFunction.params[index] = aux(param, i);
        }
      });
      return newFunction
    };
    return aux(this.right, 0);
  }
}