import type { FunctionCall, Type } from "$lang/types/parser/interfaces";
import { Latex } from "./Latex";

export class LatexMap {
  latexMap: { [id: string]: Latex } = {};

  private constructKey(call : FunctionCall){
    return call.id + "!p" +  call.params.length;
  }

  addLatex(call: Type, latex: string) {
    if (call.type == "function") this.latexMap[this.constructKey(call)] = new Latex(call, latex);
    else this.latexMap[call.value] = new Latex(call, latex);
  }
  contains(call: Type) {
    if (call.type == "function") return this.latexMap[this.constructKey(call)] != undefined;
    else return this.latexMap[call.value] != undefined;
  }

  getConstructedLatex(call: Type): string {
    if (call.type == "function") {
      if (this.latexMap[this.constructKey(call)] == undefined) {
        let str = "$" + call.id + "(";
        str += call.params.map((param) => {
          if (param.type == "function") return this.getConstructedLatex(param);

          return param.value;
        });
        str += ")$";
        return str;
      }

      return this.latexMap[this.constructKey(call)].constructLatex(call, this);
    } else {
      if (this.latexMap[call.value] == undefined) return call.value as string;

      return this.latexMap[call.value].constructLatex(call, this);
    }
  }
}
