import type { Type } from "$lang/types/parser/interfaces";
import type { LatexMap } from "./LatexMap";

export class Latex {
  paramIndex: number[] = [];
  stringArray: string[] = [""];
  paramAmount: number

  constructor(latex: string, call: Type) {
    let params: Type[];
    if (call.type == "function") {
      params = call.params;
    } else {
      params = [call];
    }
    this.paramAmount = params.length;

    const latex_array: string[] = latex.match(/([.,+*?^$&§()\[\]{}|\/|_ ]+)|([a-z,A-Z]+)/g) as string[];

    if (latex_array == null) throw new Error("No matches were found!");

    // char_index_arr = array of indexes of characters in latex_array
    const char_index_arr = latex_array
      ?.map((element, index) => {
        if (element.match(/([a-z,A-Z]+)/g)) return index;
      })
      .filter(Boolean);

    // params_index_arr = array of arrays of indexes of parameters in latex_array
    const params_index_arr: number[][] = [];

    char_index_arr?.forEach((val: number | undefined) => {
      if (val != undefined) {
        params.forEach((param, index) => {
          if (param.type == "function") throw new Error("Function type not supported for latex initialization!");
          if (params_index_arr[index] == undefined) params_index_arr[index] = [];
          if (latex_array[val] == (param.value as string)) {
            params_index_arr[index].push(val);
          }
        });
      }
    });

    // params_index_arr_flat          = params_index_arr flattened from [][] to []
    // params_index_arr_flat_indexed  = has each given call param index in relation to the params_index_arr_flat
    const params_index_arr_flat = params_index_arr.flat();
    const params_index_arr_flat_indexed = params_index_arr
      .map((val, index) => {
        return val.map(() => {
          return index;
        });
      })
      .flat();

    // stringArray = array of strings, each string is a part of the latex string, where the seperations is to be filled by the parameters of call
    latex_array?.forEach((val: string, index) => {
      if (val != undefined) {
        let indexOf = params_index_arr_flat.indexOf(index);
        if (indexOf >= 0) {
          this.stringArray.push("");
          this.paramIndex.push(params_index_arr_flat_indexed[indexOf]);
        } else {
          this.stringArray[this.stringArray.length - 1] += val;
        }
      }
    });
  }

  constructLatex(call: Type, map : LatexMap | undefined = undefined) : string{
    let params: Type[];
    if (call.type == "function") {
      params = call.params;
    } else {
      params = [call];
    }
    if (params.length != this.paramAmount) throw new Error("The amount of parameters given does not match the amount of parameters expected!");

    let tmp_latex = this.stringArray[0];


    for (let i = 1; i < this.stringArray.length; i++) {
      let param = params[this.paramIndex[i - 1]];
      if (param.type == "function") {
        if (map == undefined) throw new Error("No LatexMap was given! For Function");
        tmp_latex += map.getConstructedLatex(param).slice(1, -1);
      } else {
        tmp_latex += param.value;
      }
      tmp_latex += this.stringArray[i];
    }

    return tmp_latex;
  }
}
