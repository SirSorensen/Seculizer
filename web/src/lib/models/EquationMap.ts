import type { FunctionCall, StringLiteral, NumberLiteral, Id, Type } from "$lang/types/parser/interfaces";
import type { ParticipantKnowledge, RawParticipantKnowledge } from "src/types/participant";
import { Equal } from "./Equal";
import type { Participant } from "./Participant";
import { getStringFromType } from "$lib/utils/stringUtil";

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

  addEquation(left: FunctionCall, right: FunctionCall) {
    if (this.equations[left.id] === undefined) {
      this.equations[left.id] = { eqs: [], maxDepth: 0 };
    }
    this.equations[left.id].eqs.push(new Equal(left, right));
    this.equations[left.id].maxDepth += this.functionIdParameter(right);
  }

  doesParticipantKnow(parti: Participant, f: FunctionCall, val: Type | undefined = undefined): boolean {
    let history: Map<string, boolean> = new Map();
    let queue: queueElement[] = [];
    if (this.equations[f.id] === undefined) return parti.doesTypeAndValueExist(f, val);
    const maxDepth = this.equations[f.id].maxDepth;
    

    queue.push({ f: f, depth: 0 });

    while (queue.length > 0) {
      let current = queue.shift();
      if (current === undefined) continue;
      if (current.depth > maxDepth) continue;

      let _f = current.f
      if (history.has(getStringFromType(_f))) continue;
      history.set(getStringFromType(_f), true);

      if (parti.doesTypeAndValueExist(_f, val)) return true;

      for (const eq of this.equations[_f.id].eqs) {
        let _fEq = eq.generateEqual(_f);
        queue.push({ f: _fEq, depth: current.depth + 1 });
      }
    }

    return false;
  }

  private functionIdParameter(f: FunctionCall): number {
    let idParams = 0;

    f.params.forEach((t) => {
      if (t.type == "function") idParams += this.functionIdParameter(t);
      else idParams += 1;
    });

    return idParams;
  }

  getEquations(){
    return this.equations;
  }
}
