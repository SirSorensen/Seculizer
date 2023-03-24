import type { Type } from "$lang/types/parser/interfaces";
import { Latex } from "./Latex";


export class LatexMap {
  latexMap: { [id: string]: Latex } = {};

  constructor() {}

  addLatex(call: Type, latex: string) {
    if (call.type == "function") this.latexMap[call.id] = new Latex(call, latex);
    else this.latexMap[call.value] = new Latex(call, latex);
  }

  getConstructedLatex(call: Type): string {
    if (call.type == "function") {
      if (this.latexMap[call.id] == undefined) {
        let str = "$" + call.id + "(";
        str += call.params.map((param) => {
          if (param.type == "function") return this.getConstructedLatex(param);

          return param.value;
        });
        str += ")$";
        return str;
      }

      return this.latexMap[call.id].constructLatex(call, this);
    } else {
      if (this.latexMap[call.value] == undefined) return call.value as string;

      return this.latexMap[call.value].constructLatex(call, this);
    }
  }
}