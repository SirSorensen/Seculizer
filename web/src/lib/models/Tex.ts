import type { Type } from "$lang/types/parser/interfaces";
import type { FormatMap } from "./FormatMap";

export class Tex {
  paramIndex: number[] = [];
  stringArray: string[] = [""];
  paramAmount: number;

  constructor(call: Type, Tex: string) {
    let params: Type[];
    if (call.type == "function") {
      params = call.params;
    } else {
      params = [call];
    }
    //Params amount = 1 if the call was not a function, and the amount of params of the call if it was a function
    this.paramAmount = params.length;

    const TexArray: string[] = Tex.match(/([.,+*-?^$&%§()[\]{}|/\\|_ ]+)|([a-z,A-Z,α-ω,Α-Ω]+)/g) as string[];

    if (TexArray == null) throw new Error("No matches were found!");

    // charIndexArr = array of indexes of characters in TexArray
    const charIndexArr = TexArray
      .map((element, index) => {
        if (element.match(/([a-z,A-Z]+)/g)) return index;
      })
      .filter(Boolean);

    // paramsIndexArr = array of arrays of indexes of parameters in TexArray
    const paramsIndexArr: number[][] = [];

    for (const val of charIndexArr) {
      if (!val) continue;
      for (let index = 0; index < params.length; index++) {
        const param = params[index];
        if (param.type == "function") throw new Error("Function type not supported for Tex initialization!");
        if (!paramsIndexArr[index]) paramsIndexArr[index] = [];
        if (TexArray[val] == (param.value as string)) {
          paramsIndexArr[index].push(val);
        }
      }
    }

    // paramsIndexArrFlat          = paramsIndexArr flattened from [][] to []
    // paramsIndexArrFlatIndexed = has each given call param index in relation to the paramsIndexArrFlat
    const paramsIndexArrFlat = paramsIndexArr.flat();
    const paramsIndexArrFlatIndexed = paramsIndexArr
      .map((val, index) => {
        return val.map(() => {
          return index;
        });
      })
      .flat();

    // stringArray = array of strings, each string is a part of the Tex string, where the seperations is to be filled by the parameters of call
    for (let index = 0; index < TexArray.length; index++) {
      const val = TexArray[index];
      if (!val) continue;
      const indexOf = paramsIndexArrFlat.indexOf(index);
      if (indexOf >= 0) {
        this.stringArray.push("");
        this.paramIndex.push(paramsIndexArrFlatIndexed[indexOf]);
      } else {
        this.stringArray[this.stringArray.length - 1] += val;
      }
    }
  }

  constructTex(call: Type, map: FormatMap | undefined = undefined): string {
    let params: Type[];
    if (call.type == "function") {
      params = call.params;
    } else {
      params = [call];
    }
    if (params.length != this.paramAmount)
      throw new Error("The amount of parameters given does not match the amount of parameters expected!");

    let tmpTex = this.stringArray[0];

    for (let i = 1; i < this.stringArray.length; i++) {
      const param = params[this.paramIndex[i - 1]];
      if (param.type == "function") {
        //Function gets { } around it
        if (!map) throw new Error("No TexMap was given! For Function");
        tmpTex += "{" + map.getConstructedTex(param).slice(1, -1) + "}";
      } else if(param.type === "id"){
        if(map && map.contains(param) && !(call.type === "id" && param.value === call.value)){
          let rec = map.getConstructedTex(param);
          if(rec.startsWith("$")){
            rec = rec.slice(1);
          }
          if(rec.endsWith("$")){
            rec = rec.slice(0, -1);
          }
          tmpTex += "{" + rec + "}";
        }else{
          tmpTex += "\\text{" + param.value + "}";
        }
      }else if (param.type != "number") {
        //Anything else gets \text{ } around it
        tmpTex += "\\text{" + param.value + "}";
      } else {
        tmpTex += param.value;
      }
      tmpTex += this.stringArray[i];
    }

    return tmpTex;
  }
}
