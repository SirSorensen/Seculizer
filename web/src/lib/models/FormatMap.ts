import type { FunctionCall, Type } from "$lang/types/parser/interfaces";
import { Tex } from "./Tex";

type format =
  | {
      type: "Tex";
      value: Tex;
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

  private constructFormat(format: Tex | string) : format {
    if (format instanceof Tex) return { type: "Tex", value: format };
    else return { type: "string", value: format };
  }

  addTex(call: Type, tex: string) {
    if (call.type == "function") this.formatMap[this.constructKey(call)] = this.constructFormat(new Tex(call, tex));
    else this.formatMap[call.value] = this.constructFormat(new Tex(call, tex));
  }

  addString(call: Type, str: string) {
    if (call.type == "function") this.formatMap[this.constructKey(call)] = this.constructFormat(new Tex(call, str));
    else this.formatMap[call.value] = this.constructFormat(str);
  }

  contains(call: Type) {
    if (call.type == "function") return this.formatMap[this.constructKey(call)] != undefined;
    else return this.formatMap[call.value] != undefined;
  }

  getConstructedTex(call: Type): string {
    if (call.type == "function") {
      const format = this.formatMap[this.constructKey(call)];

      if (format == undefined) {
        let str = "$" + call.id + "(";
        str += call.params.map((param) => {
          if (param.type == "function") return this.getConstructedTex(param);

          return param.value;
        });
        str += ")$";
        return str;
      }


      if (format.type == "Tex") {
        return format.value.constructTex(call, this);
      } else return format.value;
    } else {
      const format = this.formatMap[call.value];

      if (format == undefined) return call.value as string;

      if (format.type == "Tex") {
        return format.value.constructTex(call, this);
      } else return format.value;
    }
  }
}
