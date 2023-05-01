import type { FunctionCall, Type } from "$lang/types/parser/interfaces";
import { Latex } from "./Latex";

type format =
  | {
      type: "latex";
      value: Latex;
    }
  | {
      type: "string";
      value: string;
    };

export class FormatMap {
  formatMap: { [id: string]: format } = {};

  private constructKey(call: FunctionCall) : string {
    return call.id + "!p" + call.params.length;
  }

  private constructFormat(format: Latex | string) : format {
    if (format instanceof Latex) return { type: "latex", value: format };
    else return { type: "string", value: format };
  }

  addLatex(call: Type, latex: string) {
    if (call.type == "function") this.formatMap[this.constructKey(call)] = this.constructFormat(new Latex(call, latex));
    else this.formatMap[call.value] = this.constructFormat(new Latex(call, latex));
  }

  addString(call: Type, str: string) {
    if (call.type == "function") this.formatMap[this.constructKey(call)] = this.constructFormat(new Latex(call, str));
    else this.formatMap[call.value] = this.constructFormat(str);
  }

  contains(call: Type) {
    if (call.type == "function") return this.formatMap[this.constructKey(call)] != undefined;
    else return this.formatMap[call.value] != undefined;
  }

  getConstructedLatex(call: Type): string {
    if (call.type == "function") {
      const format = this.formatMap[this.constructKey(call)];

      if (format == undefined) {
        let str = "$" + call.id + "(";
        str += call.params.map((param) => {
          if (param.type == "function") return this.getConstructedLatex(param);

          return param.value;
        });
        str += ")$";
        return str;
      }


      if (format.type == "latex") {
        return format.value.constructLatex(call, this);
      } else return format.value;
    } else {
      const format = this.formatMap[call.value];

      if (format == undefined) return call.value as string;

      if (format.type == "latex") {
        return format.value.constructLatex(call, this);
      } else return format.value;
    }
  }
}
