import type { FunctionCall, StringLiteral, NumberLiteral, Id, Type } from "$lang/types/parser/interfaces";
import type { ParticipantKnowledge, RawParticipantKnowledge } from "src/types/participant";
import { Equal } from "./Equal";
import type { Participant } from "./Participant";

type equalResult = {
  eqs: Equal[];
  maxDepth: number;
};

type queueElement = {
    f: FunctionCall;
    depth: number;
}

export class EquationMap {
  private equations: { [id: string]: equalResult } = {};
  private history : Map<FunctionCall, boolean> = new Map();

  addEquation(left: FunctionCall, right: FunctionCall) {
    this.equations[left.id].eqs.push(new Equal(left, right));
  }

  private _doesParticipantKnow(parti: Participant, f: FunctionCall, depth : number, maxDepth : number, val: Type | undefined = undefined): boolean {
    
    
    if (this.history.has(f)) return false;
    this.history.set(f, true);

    if (parti.doesTypeAndValueExist(f, val)) return true;
    


    this.equations[f.id].eqs.forEach((eq) => {
      let _f = eq.generateEqual(f);
      if (this._doesParticipantKnow(parti, _f, depth, maxDepth, val)) return true;
    });

    return false;
  }

  doesParticipantKnow(parti: Participant, f: FunctionCall, val: Type | undefined = undefined): boolean {
    this.history = new Map();
    return this._doesParticipantKnow(parti, f, 0, this.equations[f.id].maxDepth, val);
  }

  CalcMaxDepth() {
    for (let key in this.equations) {
      let equal_result = this.equations[key];
      equal_result.eqs.forEach((eq) => {
        equal_result.maxDepth += this.functionIdParameter(eq.getRight());
      });
      this.equations[key] = equal_result;
    }
  }

  private functionIdParameter(f: FunctionCall): number {
    let idParams = 0;

    f.params.forEach((t) => {
      if (t.type == "function") idParams += this.functionIdParameter(t);
      else idParams += 1;
    });

    return idParams;
  }

  getEquationById(id: string) {
    return this.equations[id];
  }
}
