import type { Type } from "$lang/types/parser/interfaces";

export class Latex {
  latex: string;

  constructor(latex: string, params: Type[]) {
    this.latex = latex;

    let latex_array : string[] = latex.match(/([.,+*?^$()\[\]{}|\/| ]+)|([a-z,A-Z]+)/g) as string[];
    if (latex_array == null) throw new Error("Latex array is null!");

    let char_index_arr = latex_array?.map((element, index) => {
        if (element.match(/([a-z,A-Z]+)/g)) return index;
      }).filter(Boolean);

    let params_index_arr = []


    char_index_arr?.forEach((val : number | undefined) => {
        if (val != undefined) {
            params.forEach((param) => {
                if (param.type == "function") throw new Error ("Function type not supported!");
                if (latex_array[val] == (param.value as string)) {
                    params_index_arr.push(val)
                };
            })
        }
    });


    console.log(latex_array);
  }
} 