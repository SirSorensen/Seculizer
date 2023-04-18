import { Program } from "$lib/models/program.js";
import { afterEach, expect, test } from "vitest";
import { readFileSync } from "fs";
import { parse } from "$lang/index.js";
import type { Id, Type, FunctionCall } from "$lang/types/parser/interfaces";
import type { Frame } from "$lib/models/Frame";
import path from "path";
import { Latex } from "../src/lib/models/Latex";
import { fileURLToPath } from "url";
import { LatexMap } from "$lib/models/LatexMap";
import { Equal } from "$lib/models/Equal";
import { EquationMap } from "$lib/models/EquationMap";
import type { ParticipantKnowledge, RawParticipantKnowledge } from "src/types/participant";
import { Participant } from "$lib/models/Participant";
import { getStringFromType } from "$lib/utils/stringUtil";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const examplesFolder = path.resolve(__dirname, "../../specification/Examples");
let program: Program;

function startFunction(str: string) {
  if (typeof str == "string" && str == "") throw new Error('No test file given! (str == ""');

  const relativePath = path.resolve(examplesFolder, str + ".sepo");
  const fileStr = readFileSync(relativePath);
  const json = parse(fileStr, false);

  program = new Program(json, false);
}

let undefinedProgram: Program;
afterEach(() => {
  program = undefinedProgram;
});

test("web/program with simple.sepo", () => {
  startFunction("Samples/simple");
  expect(program).toBeDefined();

  expect(program.keyRelations).toBeDefined();
  expect(Object.keys(program.keyRelations).length).toBeGreaterThan(0);

  expect(program.functions).toBeDefined();
  expect(Object.keys(program.functions).length).toBeGreaterThan(0);

  expect(program.formats).toBeDefined();
  expect(Object.keys(program.formats).length).toBeGreaterThan(0);

  expect(Object.keys(program.equations).length).toBeGreaterThan(0);

  expect(program.icons.size).toBe(0);
});

test("web/program with TPM.sepo", () => {
  startFunction("Protocols/Envelope");
  expect(program).toBeDefined();
});

test("web/program with key-relation.sepo", () => {
  startFunction("Samples/key-relation");
  expect(program).toBeTruthy();
});

test("web/program with DF.sepo", () => {
  startFunction("Protocols/Diffie-hellman");
  expect(program).toBeDefined();

  expect(program.keyRelations).toBeDefined();
  expect(Object.keys(program.keyRelations).length).toBe(0);

  expect(program.functions).toBeDefined();
  expect(Object.keys(program.functions).length).toBeGreaterThan(0);

  expect(program.formats).toBeDefined();
  expect(Object.keys(program.formats).length).toBeGreaterThan(0);

  expect(program.equations).toBeDefined();
  expect(Object.keys(program.equations).length).toBe(1);

  expect(program.icons).toBeDefined();
  expect(program.icons.size).toBe(7);
});

test("web/program with send-with-sign.sepo", () => {
  startFunction("Samples/send-with-sign");
  expect(program).toBeDefined();

  expect(program.keyRelations).toBeDefined();
  expect(Object.keys(program.keyRelations).length).toBe(0);

  expect(program.functions).toBeDefined();
  expect(Object.keys(program.functions).length).toBe(0);

  expect(program.formats).toBeDefined();
  expect(Object.keys(program.formats.latexMap).length).toBe(0);

  expect(program.equations).toBeDefined();
  expect(Object.keys(program.equations.getEquations()).length).toBe(0);

  expect(program.icons).toBeDefined();
  expect(program.icons.size).toBe(0);

  expect(program.first).toBeTruthy();
  const first = program.first as Frame;

  let last = first.getLast();
  expect(last).toBeTruthy();
  expect(last).toBeDefined();
  last = last as Frame;

  expect(last.getParticipantMap().getParticipants()).toBeDefined();
  expect(last.getParticipantMap().getParticipantAmount()).toBe(3);
  expect(last.getParticipantMap().getParticipant("Alice")).toBeDefined();
  expect(last.getParticipantMap().getParticipant("Bob")).toBeDefined();

  expect(last.getParticipantMap().getParticipant("Alice").getKnowledgeList().length).toBeGreaterThan(
    first.getParticipantMap().getParticipant("Alice").getKnowledgeList().length
  );
  expect(last.getParticipantMap().getParticipant("Bob").getKnowledgeList().length).toBeGreaterThan(
    first.getParticipantMap().getParticipant("Bob").getKnowledgeList().length
  );

  const msg_A: ParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: {
      type: "id",
      value: "msg_A",
    },
  };

  const msg_B: ParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: {
      type: "id",
      value: "msg_B",
    },
  };

  expect(first.getParticipantMap().getParticipant("Alice").doesKnowledgeExist(msg_A)).toBeTruthy();
  expect(first.getParticipantMap().getParticipant("Alice").doesKnowledgeExist(msg_B)).toBeFalsy();
  expect(first.getParticipantMap().getParticipant("Bob").doesKnowledgeExist(msg_A)).toBeFalsy();
  expect(first.getParticipantMap().getParticipant("Bob").doesKnowledgeExist(msg_B)).toBeTruthy();

  expect(last.getParticipantMap().getParticipant("Alice").doesKnowledgeExist(msg_A)).toBeTruthy();
  expect(last.getParticipantMap().getParticipant("Alice").doesKnowledgeExist(msg_B)).toBeTruthy();
  expect(last.getParticipantMap().getParticipant("Bob").doesKnowledgeExist(msg_A)).toBeTruthy();
  expect(last.getParticipantMap().getParticipant("Bob").doesKnowledgeExist(msg_B)).toBeTruthy();
});

test("web/program with send-with-enc.sepo", () => {
  startFunction("Samples/send-with-enc");
  expect(program).toBeDefined();

  expect(program.keyRelations).toBeDefined();
  expect(Object.keys(program.keyRelations).length).toBe(0);

  expect(program.functions).toBeDefined();
  expect(Object.keys(program.functions).length).toBe(0);

  expect(program.formats).toBeDefined();
  expect(Object.keys(program.formats.latexMap).length).toBe(0);

  expect(program.equations).toBeDefined();
  expect(Object.keys(program.equations.getEquations()).length).toBe(0);

  expect(program.icons).toBeDefined();
  expect(program.icons.size).toBe(0);

  expect(program.first).toBeTruthy();
  const first = program.first as Frame;

  let last = first.getLast();
  expect(last).toBeTruthy();
  expect(last).toBeDefined();
  last = last as Frame;

  expect(last.getParticipantMap().getParticipants()).toBeDefined();
  expect(last.getParticipantMap().getParticipantAmount()).toBe(3);
  expect(last.getParticipantMap().getParticipant("Alice")).toBeDefined();
  expect(last.getParticipantMap().getParticipant("Bob")).toBeDefined();

  expect(last.getParticipantMap().getParticipant("Alice").getKnowledgeList().length).toBeGreaterThan(
    first.getParticipantMap().getParticipant("Alice").getKnowledgeList().length
  );
  expect(last.getParticipantMap().getParticipant("Bob").getKnowledgeList().length).toBeGreaterThan(
    first.getParticipantMap().getParticipant("Bob").getKnowledgeList().length
  );

  const msg_A: ParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: {
      type: "id",
      value: "msg_A",
    },
  };

  const msg_B: ParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: {
      type: "id",
      value: "msg_B",
    },
  };

  expect(first.getParticipantMap().getParticipant("Alice").doesKnowledgeExist(msg_A)).toBeTruthy();
  expect(first.getParticipantMap().getParticipant("Alice").doesKnowledgeExist(msg_B)).toBeFalsy();
  expect(first.getParticipantMap().getParticipant("Bob").doesKnowledgeExist(msg_A)).toBeFalsy();
  expect(first.getParticipantMap().getParticipant("Bob").doesKnowledgeExist(msg_B)).toBeTruthy();

  expect(last.getParticipantMap().getParticipant("Alice").doesKnowledgeExist(msg_A)).toBeTruthy();
  expect(last.getParticipantMap().getParticipant("Alice").doesKnowledgeExist(msg_B)).toBeTruthy();
  expect(last.getParticipantMap().getParticipant("Bob").doesKnowledgeExist(msg_A)).toBeTruthy();
  expect(last.getParticipantMap().getParticipant("Bob").doesKnowledgeExist(msg_B)).toBeTruthy();
});

test("web/program with send.sepo", () => {
  startFunction("Samples/send");
  expect(program).toBeTruthy();
});

test("web/program with send-with-enc.sepo", () => {
  startFunction("Samples/send-with-enc");
  expect(program).toBeTruthy();
});

test("web/program with send-and-clear.sepo", () => {
  startFunction("Samples/send-and-clear");
  expect(program).toBeTruthy();
  let last = program.first?.getLast();
  expect(last).toBeTruthy();
  expect(last).toBeDefined();
  last = last as Frame;

  expect(last.getParticipantMap().getParticipants()).toBeDefined();

  const amountOfParticipants = last.getParticipantMap().getParticipantAmount();
  expect(amountOfParticipants).toBe(3);

  const alice = last.getParticipantMap().getParticipant("Alice");
  expect(alice).toBeDefined();

  expect(alice?.getKnowledgeList().length).toBe(0);
});

test("web/Program with icon-test.sepo", () => {
  startFunction("Samples/icon-test");
  expect(program).toBeTruthy();
  expect(program.icons).toBeTruthy();
  expect(program.icons.size).toBe(5);
  const id: Id = { type: "id", value: "Alice" };
  const icon = program.icons.get(id.value);
  expect(icon).toBeTruthy();
  expect(icon).toBe("woman");
});

test("web/Program with clear.sepo", () => {
  startFunction("Samples/clear");
  expect(program).toBeTruthy();
  const first = program.first;
  expect(first).toBeTruthy();
  const firstParticipants = first?.getParticipantMap().getParticipants();
  expect(Object.keys(firstParticipants || {}).length).toBe(3);

  for (const key of Object.keys(firstParticipants || {})) {
    if (key === "Shared") continue;
    if (!firstParticipants) throw new Error("firstParticipants is undefined");
    const participant = firstParticipants[key];

    expect(participant).toBeTruthy();
    expect(participant?.getKnowledgeList().length).toBe(1);
  }
  const last = first?.getLast();
  expect(last).toBeTruthy();
  const participants = last?.getParticipantMap().getParticipants();
  expect(participants).toBeTruthy();
  expect(Object.keys(participants || {}).length).toBe(3);
  for (const participant of Object.values(participants || {})) {
    expect(participant.getKnowledgeList().length).toBe(0);
  }
});

test("Construct Latex class & constructLatex method test", () => {
  const init_param1: Type = { type: "id", value: "x" };
  const init_param2: Type = { type: "id", value: "y" };
  const init_func: FunctionCall = { type: "function", id: "Hash", params: [init_param1, init_param2] };

  const latex = new Latex(init_func, "$Hash(x||y||x)$");

  const param1: Type = { type: "id", value: "z" };
  const param2: Type = { type: "number", value: 5 };
  const func: FunctionCall = { type: "function", id: "Hash", params: [param1, param2] };

  const result = latex.constructLatex(func);

  expect(result).toBe("$Hash(\\text{z}||5||\\text{z})$");
});

test("Make LatexMap and call a function with embedded function", () => {
  const init_param1: Type = { type: "id", value: "x" };
  const init_param2: Type = { type: "id", value: "y" };
  const init_func1: FunctionCall = { type: "function", id: "Hash", params: [init_param1, init_param2] };
  const init_func2: FunctionCall = { type: "function", id: "Base", params: [init_param1, init_param2] };

  const latexMap = new LatexMap();
  latexMap.addLatex(init_func1, "$Hash(x||y||x)$");
  latexMap.addLatex(init_func2, "$Based_{XXX}(y&&x)$");

  const param1: Type = { type: "id", value: "z" };
  const param2: Type = { type: "number", value: 5 };
  const param3: Type = { type: "string", value: "Jesus" };
  const func1: FunctionCall = { type: "function", id: "Hash", params: [param1, param2] };
  const func2: FunctionCall = { type: "function", id: "Base", params: [param3, func1] };

  const result = latexMap.getConstructedLatex(func2);

  expect(result).toBe("$Based_{XXX}({Hash(\\text{z}||5||\\text{z})}&&\\text{Jesus})$");
});

test("Construct an Equal and call generateEqual", () => {
  const init_param1: Type = { type: "id", value: "x" };
  const init_param2: Type = { type: "id", value: "y" };
  const init_func1: FunctionCall = { type: "function", id: "Hash", params: [init_param1, init_param2] };
  const init_func2: FunctionCall = { type: "function", id: "Base", params: [init_param2, init_param1] };

  const equality = new Equal(init_func1, init_func2);

  const param1: Type = { type: "id", value: "z" };
  const param2: Type = { type: "id", value: "v" };
  const func: FunctionCall = { type: "function", id: "Hash", params: [param1, param2] };

  const result = equality.generateEqual(func);
  const expected: FunctionCall = { type: "function", id: "Base", params: [param2, param1] };

  expect(result.id).toBe(expected.id);
  expect(result.type).toBe(expected.type);
  expect(result.params[0]).toBe(expected.params[0]);
  expect(result.params[1]).toBe(expected.params[1]);
});

test("Construct an Equal and call generateEqual with embedded functions", () => {
  const init_param1: Type = { type: "id", value: "x" };
  const init_param2: Type = { type: "id", value: "y" };
  const init_param3: Type = { type: "id", value: "z" };

  const init_func1: FunctionCall = { type: "function", id: "exp", params: [init_param2, init_param3] };
  const init_func2: FunctionCall = { type: "function", id: "exp", params: [init_param1, init_func1] };

  const init_func3: FunctionCall = { type: "function", id: "exp", params: [init_param3, init_param2] };
  const init_func4: FunctionCall = { type: "function", id: "exp", params: [init_param1, init_func3] };

  const equality = new Equal(init_func2, init_func4);

  const param1: Type = { type: "id", value: "a" };
  const param2: Type = { type: "id", value: "b" };
  const param3: Type = { type: "id", value: "c" };
  const func1: FunctionCall = { type: "function", id: "exp", params: [param2, param3] };
  const func2: FunctionCall = { type: "function", id: "exp", params: [param1, func1] };

  const result = equality.generateEqual(func2);
  const tmp_expected: FunctionCall = { type: "function", id: "exp", params: [param3, param2] };
  const expected: FunctionCall = { type: "function", id: "exp", params: [param1, tmp_expected] };

  expect(result.id).toBe(expected.id);
  expect(result.type).toBe(expected.type);
  expect(result.params[0]).toBe(expected.params[0]);
  if (result.params[1].type == "function" && expected.params[1].type == "function") {
    expect(result.params[1].params[0]).toBe(expected.params[1].params[0]);
    expect(result.params[1].params[1]).toBe(expected.params[1].params[1]);
  }
});

test("Construct an EquationMap and check if Participant knows", () => {
  const init_param1: Type = { type: "id", value: "x" };
  const init_param2: Type = { type: "id", value: "y" };
  const init_func1: FunctionCall = { type: "function", id: "Hash", params: [init_param1, init_param2] }; // Hash(x,y)
  const init_func2: FunctionCall = { type: "function", id: "Hash", params: [init_param2, init_param1] }; // Hash(y,x)

  const init_func3: FunctionCall = { type: "function", id: "Base", params: [init_param1, init_param2] }; // Base(x,y)
  const init_func4: FunctionCall = { type: "function", id: "Base", params: [init_param2, init_param1] }; // Base(y,x)

  const equalityMap = new EquationMap();
  equalityMap.addEquation(init_func1, init_func2); // Hash(x,y) => Hash(y,x)
  equalityMap.addEquation(init_func3, init_func4); // Base(x,y) => Base(y,x)

  const param1: Type = { type: "id", value: "z" };
  const param2: Type = { type: "id", value: "v" };

  const func: FunctionCall = { type: "function", id: "Hash", params: [param1, param2] }; // Hash(z,v)
  const modified_func: FunctionCall = { type: "function", id: "Hash", params: [param2, param1] }; // Hash(v,z)
  const base_func: FunctionCall = { type: "function", id: "Base", params: [param1, param2] }; // Base(z,v)

  const init_knowledge: RawParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: func,
  };

  const parti: Participant = new Participant("Alice");
  parti.setKnowledge(init_knowledge);

  const result1 = equalityMap.doesParticipantKnow(parti, func);
  const result2 = equalityMap.doesParticipantKnow(parti, modified_func);
  const result3 = equalityMap.doesParticipantKnow(parti, base_func);

  expect(result1).toBeTruthy();
  expect(result2).toBeTruthy();
  expect(result3).toBeFalsy();
});

test("Does cloneFunctionChangedParams work", () => {
  const init_param1: Type = { type: "id", value: "x" };
  const init_param2: Type = { type: "id", value: "y" };
  const init_func1: FunctionCall = { type: "function", id: "Hash", params: [init_param1, init_param2] }; // Hash(x,y)
  const init_func2: FunctionCall = { type: "function", id: "Base", params: [init_param2, init_func1] }; // Base(y,Hash(x,y))
  const init_func3: FunctionCall = { type: "function", id: "shesh", params: [init_param1, init_param2] }; // shesh(x,y)

  const param_depth = [1];

  const equalityMap = new EquationMap();

  const f = equalityMap.cloneFunctionChangedParam(init_func2, param_depth, init_func3);
  const expectedF: FunctionCall = { type: "function", id: "Base", params: [init_param2, init_func3] }; // Base(y,shesh(x,y))

  expect(getStringFromType(expectedF)).toBe(getStringFromType(f));
});

test("Construct an EquationMap with functions with nested functions", () => {
  const init_param1: Type = { type: "id", value: "a" };
  const init_param2: Type = { type: "id", value: "b" };
  const init_func1: FunctionCall = { type: "function", id: "foo", params: [init_param1, init_param2] }; // foo(a,b)
  const init_func2: FunctionCall = { type: "function", id: "lee", params: [init_param1, init_param2] }; // lee(a,b)
  const init_func3: FunctionCall = { type: "function", id: "foo", params: [init_func2, init_param2] }; // foo(lee(a,b),b)

  const equalityMap = new EquationMap();
  equalityMap.addEquation(init_func1, init_func3); // foo(a,b) => foo(lee(a,b),b)

  const param1: Type = { type: "id", value: "x" };
  const param2: Type = { type: "id", value: "y" };

  const func: FunctionCall = { type: "function", id: "foo", params: [param1, param2] }; // foo(x,y)
  const help_func1: FunctionCall = { type: "function", id: "lee", params: [param1, param2] }; // lee(x,y)
  const modified_func1: FunctionCall = { type: "function", id: "foo", params: [help_func1, param2] }; // foo(lee(x,y),y))
  const help_func2: FunctionCall = { type: "function", id: "lee", params: [help_func1, param2] }; // lee(lee(x,y),y)
  const modified_func2: FunctionCall = { type: "function", id: "foo", params: [help_func2, param2] }; // foo(lee(lee(x,y),y),y)
  const help_func3: FunctionCall = { type: "function", id: "lee", params: [help_func2, param2] }; // lee(lee(lee(x,y),y),y)
  const modified_func3: FunctionCall = { type: "function", id: "foo", params: [help_func3, param2] }; // foo(lee(lee(lee(x,y),y),y),y)
  const help_func4: FunctionCall = { type: "function", id: "lee", params: [help_func3, param2] }; // lee(lee(lee(lee(x,y),y),y))
  const modified_func4: FunctionCall = { type: "function", id: "foo", params: [help_func4, param2] }; // foo(lee(lee(lee(lee(x,y),y),y),y),y)

  const init_knowledge: RawParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: modified_func1,
  };
  const init_knowledge2: RawParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: modified_func2,
  };
  const init_knowledge3: RawParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: modified_func3,
  };
  const init_knowledge4: RawParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: modified_func4,
  };

  const parti: Participant = new Participant("Alice");
  parti.setKnowledge(init_knowledge);

  const parti2: Participant = new Participant("Alice2");
  parti2.setKnowledge(init_knowledge2);

  const parti3: Participant = new Participant("Alice3");
  parti3.setKnowledge(init_knowledge3);

  const parti4: Participant = new Participant("Alice4");
  parti3.setKnowledge(init_knowledge4);

  const result1 = equalityMap.doesParticipantKnow(parti, func);
  const result2 = equalityMap.doesParticipantKnow(parti, help_func1);
  const result3 = equalityMap.doesParticipantKnow(parti, modified_func1);

  const result1_2 = equalityMap.doesParticipantKnow(parti2, func);
  const result2_2 = equalityMap.doesParticipantKnow(parti2, help_func1);
  const result3_2 = equalityMap.doesParticipantKnow(parti2, modified_func1);

  const result1_3 = equalityMap.doesParticipantKnow(parti3, func);
  const result2_3 = equalityMap.doesParticipantKnow(parti3, help_func1);
  const result3_3 = equalityMap.doesParticipantKnow(parti3, modified_func1);

  const result1_4 = equalityMap.doesParticipantKnow(parti4, func);
  const result2_4 = equalityMap.doesParticipantKnow(parti4, help_func1);
  const result3_4 = equalityMap.doesParticipantKnow(parti4, modified_func1);

  expect(result1).toBeTruthy();
  expect(result2).toBeFalsy();
  expect(result3).toBeTruthy();

  expect(result1_2).toBeTruthy();
  expect(result2_2).toBeFalsy();
  expect(result3_2).toBeTruthy();

  expect(result1_3).toBeTruthy();
  expect(result2_3).toBeFalsy();
  expect(result3_3).toBeTruthy();

  expect(result1_4).toBeTruthy();
  expect(result2_4).toBeFalsy();
  expect(result3_4).toBeTruthy();
});
