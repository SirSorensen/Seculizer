import { Program } from "$lib/models/program.js";
import { afterEach, expect, test } from "vitest";
import { readFileSync } from "fs";
import { parse } from "$lang/index.js";
import type { Id, Type, FunctionCall } from "$lang/types/parser/interfaces";
import type { Frame } from "$lib/models/Frame";
import path from "path";
import { Tex } from "../src/lib/models/Tex";
import { fileURLToPath } from "url";
import { FormatMap } from "$lib/models/FormatMap";
import { Equal } from "$lib/models/Equal";
import type { ParticipantKnowledge, RawParticipantKnowledge } from "src/types/participant";
import { Participant } from "$lib/models/Participant";
import { getStringFromType } from "$lib/utils/stringUtil";
import { KnowledgeHandler } from "../src/lib/models/KnowledgeHandler";

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

  expect(program.knowledgeHandler.getKeyRelations()).toBeDefined();
  expect(Object.keys(program.knowledgeHandler.getKeyRelations()).length).toBeGreaterThan(0);

  expect(program.knowledgeHandler.getOpaqueFunctions()).toBeDefined();
  expect(program.knowledgeHandler.getOpaqueFunctions().length).toBeGreaterThan(0);

  expect(program.formats).toBeDefined();
  expect(Object.keys(program.formats).length).toBeGreaterThan(0);

  expect(Object.keys(program.knowledgeHandler.equations).length).toBeGreaterThan(0);

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

  expect(program.knowledgeHandler.getKeyRelations()).toBeDefined();
  expect(Object.keys(program.knowledgeHandler.getKeyRelations()).length).toBe(0);

  expect(program.knowledgeHandler.getOpaqueFunctions()).toBeDefined();
  expect(program.knowledgeHandler.getOpaqueFunctions().length).toBe(0);

  expect(program.formats).toBeDefined();
  expect(Object.keys(program.formats).length).toBeGreaterThan(0);

  expect(program.knowledgeHandler.getEquations()).toBeDefined();
  expect(Object.keys(program.knowledgeHandler.getEquations().getEquations()).length).toBe(1);

  expect(program.icons).toBeDefined();
  expect(program.icons.size).toBe(8);
});

test("web/program with send-with-sign.sepo", () => {
  startFunction("Samples/send-with-sign");
  expect(program).toBeDefined();

  expect(program.knowledgeHandler.getKeyRelations()).toBeDefined();
  expect(Object.keys(program.knowledgeHandler.getKeyRelations()).length).toBe(0);

  expect(program.knowledgeHandler.getOpaqueFunctions()).toBeDefined();
  expect(program.knowledgeHandler.getOpaqueFunctions().length).toBe(0);

  expect(program.formats).toBeDefined();
  expect(Object.keys(program.formats.formatMap).length).toBe(0);

  expect(program.knowledgeHandler.getEquations()).toBeDefined();
  expect(Object.keys(program.knowledgeHandler.getEquations().getEquations()).length).toBe(0);

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

  expect(program.knowledgeHandler.getKeyRelations()).toBeDefined();
  expect(Object.keys(program.knowledgeHandler.getKeyRelations()).length).toBe(0);

  expect(program.knowledgeHandler.getOpaqueFunctions()).toBeDefined();
  expect(program.knowledgeHandler.getOpaqueFunctions().length).toBe(0);

  expect(program.formats).toBeDefined();
  expect(Object.keys(program.formats.formatMap).length).toBe(0);

  expect(program.knowledgeHandler.getEquations()).toBeDefined();
  expect(Object.keys(program.knowledgeHandler.getEquations().getEquations()).length).toBe(0);

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

test("Construct Tex class & constructTex method test", () => {
  const init_param1: Type = { type: "id", value: "x" };
  const init_param2: Type = { type: "id", value: "y" };
  const init_func: FunctionCall = { type: "function", id: "Hash", params: [init_param1, init_param2] };

  const tex = new Tex(init_func, "$Hash(x||y||x)$");

  const param1: Type = { type: "id", value: "z" };
  const param2: Type = { type: "number", value: 5 };
  const func: FunctionCall = { type: "function", id: "Hash", params: [param1, param2] };

  const result = tex.constructTex(func);

  expect(result).toBe("$Hash(\\text{z}||5||\\text{z})$");
});

test("Make FormatMap and call a function with embedded function", () => {
  const init_param1: Type = { type: "id", value: "x" };
  const init_param2: Type = { type: "id", value: "y" };
  const init_func1: FunctionCall = { type: "function", id: "Hash", params: [init_param1, init_param2] };
  const init_func2: FunctionCall = { type: "function", id: "Base", params: [init_param1, init_param2] };

  const formatMap = new FormatMap();
  formatMap.addTex(init_func1, "$Hash(x||y||x)$");
  formatMap.addTex(init_func2, "$Based_{XXX}(y&&x)$");

  const param1: Type = { type: "id", value: "z" };
  const param2: Type = { type: "number", value: 5 };
  const param3: Type = { type: "string", value: "Jesus" };
  const func1: FunctionCall = { type: "function", id: "Hash", params: [param1, param2] };
  const func2: FunctionCall = { type: "function", id: "Base", params: [param3, func1] };

  const result = formatMap.getConstructedTex(func2);

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

  expect(result).toBeDefined();
  if (result === undefined) throw new Error("result is undefined");
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

  expect(result).toBeDefined();
  if (result === undefined) throw new Error("result is undefined");
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

  const knowledgeHandler = new KnowledgeHandler();
  knowledgeHandler.getEquations().addEquation(init_func1, init_func2); // Hash(x,y) => Hash(y,x)
  knowledgeHandler.getEquations().addEquation(init_func3, init_func4); // Base(x,y) => Base(y,x)

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

  const result1 = knowledgeHandler.isFunctionKnown(parti, func, undefined);
  const result2 = knowledgeHandler.isFunctionKnown(parti, modified_func, undefined);
  const result3 = knowledgeHandler.isFunctionKnown(parti, base_func, undefined);

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

  const knowledgeHandler = new KnowledgeHandler();

  const f = knowledgeHandler.cloneFunctionChangedParam(init_func2, param_depth, init_func3);
  const expectedF: FunctionCall = { type: "function", id: "Base", params: [init_param2, init_func3] }; // Base(y,shesh(x,y))

  expect(getStringFromType(expectedF)).toBe(getStringFromType(f));
});

test("Construct an EquationMap with functions with nested right functions", () => {
  const init_param1: Type = { type: "id", value: "a" };
  const init_param2: Type = { type: "id", value: "b" };
  const init_func1: FunctionCall = { type: "function", id: "foo", params: [init_param1, init_param2] }; // foo(a,b)
  const init_func2: FunctionCall = { type: "function", id: "lee", params: [init_param1, init_param2] }; // lee(a,b)
  const init_func3: FunctionCall = { type: "function", id: "foo", params: [init_func2, init_param2] }; // foo(lee(a,b),b)

  const knowledgeHandler = new KnowledgeHandler();
  knowledgeHandler.getEquations().addEquation(init_func1, init_func3); // foo(a,b) => foo(lee(a,b),b)

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

  const result1 = knowledgeHandler.isFunctionKnown(parti, func, undefined);
  const result2 = knowledgeHandler.isFunctionKnown(parti, help_func1, undefined);
  const result3 = knowledgeHandler.isFunctionKnown(parti, modified_func1, undefined);

  const result1_2 = knowledgeHandler.isFunctionKnown(parti2, func, undefined);
  const result2_2 = knowledgeHandler.isFunctionKnown(parti2, help_func1, undefined);
  const result3_2 = knowledgeHandler.isFunctionKnown(parti2, modified_func1, undefined);

  const result1_3 = knowledgeHandler.isFunctionKnown(parti3, func, undefined);
  const result2_3 = knowledgeHandler.isFunctionKnown(parti3, help_func1, undefined);
  const result3_3 = knowledgeHandler.isFunctionKnown(parti3, modified_func1, undefined);

  const result1_4 = knowledgeHandler.isFunctionKnown(parti4, func, undefined);
  const result2_4 = knowledgeHandler.isFunctionKnown(parti4, help_func1, undefined);
  const result3_4 = knowledgeHandler.isFunctionKnown(parti4, modified_func1, undefined);

  expect(result1).toBeTruthy();
  expect(result2).toBeFalsy();
  expect(result3).toBeTruthy();

  expect(result1_2).toBeTruthy();
  expect(result2_2).toBeFalsy();
  expect(result3_2).toBeTruthy();

  expect(result1_3).toBeFalsy();
  expect(result2_3).toBeFalsy();
  expect(result3_3).toBeTruthy();

  expect(result1_4).toBeFalsy();
  expect(result2_4).toBeFalsy();
  expect(result3_4).toBeFalsy();
});


test("Functions with nested right functions and multiple steps don't work", () => {
  const init_param1: Type = { type: "id", value: "a" };
  const init_param2: Type = { type: "id", value: "b" };
  const init_func1: FunctionCall = { type: "function", id: "foo", params: [init_param1, init_param2] }; // foo(a,b)
  const init_func2: FunctionCall = { type: "function", id: "lee", params: [init_param1, init_param2] }; // lee(a,b)
  const init_func3: FunctionCall = { type: "function", id: "gaa", params: [init_param1, init_param2] }; // gaa(a,b)
  const init_func4: FunctionCall = { type: "function", id: "foo", params: [init_func2, init_param2] }; // foo(lee(a,b),b)

  const knowledgeHandler = new KnowledgeHandler();
  knowledgeHandler.getEquations().addEquation(init_func3, init_func4); // gaa(a,b) => foo(lee(a,b),b)
  knowledgeHandler.getEquations().addEquation(init_func1, init_func2); // foo(a,b) => lee(a,b)
  knowledgeHandler.getEquations().addEquation(init_func2, init_func3); // lee(a,b) => gaa(a,b)

  const param1: Type = { type: "id", value: "x" };
  const param2: Type = { type: "id", value: "y" };

  const func1: FunctionCall = { type: "function", id: "foo", params: [param1, param2] }; // foo(x,y)
  const func2: FunctionCall = { type: "function", id: "lee", params: [param1, param2] }; // lee(x,y)
  const func3: FunctionCall = { type: "function", id: "gaa", params: [param1, param2] }; // gaa(x,y)
  const modified_func2: FunctionCall = { type: "function", id: "gaa", params: [func3, param2] }; // gaa(gaa(x,y),y))

  const init_knowledge: RawParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: modified_func2,
  };

  const parti: Participant = new Participant("Alice");
  parti.setKnowledge(init_knowledge);

  const result1 = knowledgeHandler.isFunctionKnown(parti, func1, undefined);
  const result2 = knowledgeHandler.isFunctionKnown(parti, func2, undefined);
  const result3 = knowledgeHandler.isFunctionKnown(parti, func3, undefined);

  expect(result1).toBeFalsy();
  expect(result2).toBeFalsy();
  expect(result3).toBeTruthy();
});

test("Construct an EquationMap with functions with nested known functions and multiple steps", () => {
  const init_param1: Type = { type: "id", value: "a" };
  const init_param2: Type = { type: "id", value: "b" };
  const init_func1: FunctionCall = { type: "function", id: "foo", params: [init_param1, init_param2] }; // foo(a,b)
  const init_func2: FunctionCall = { type: "function", id: "lee", params: [init_param1, init_param2] }; // lee(a,b)
  const init_func3: FunctionCall = { type: "function", id: "gaa", params: [init_param1, init_param2] }; // gaa(a,b)
  const init_func4: FunctionCall = { type: "function", id: "tuu", params: [init_param1, init_param2] }; // tuu(a,b)

  const knowledgeHandler = new KnowledgeHandler();
  knowledgeHandler.getEquations().addEquation(init_func1, init_func2); // foo(a,b) => lee(a,b)
  knowledgeHandler.getEquations().addEquation(init_func2, init_func3); // lee(a,b) => gaa(a,b)
  knowledgeHandler.getEquations().addEquation(init_func3, init_func4); // gaa(a,b) => tuu(a,b)

  const param1: Type = { type: "id", value: "x" };
  const param2: Type = { type: "id", value: "y" };

  const func1: FunctionCall = { type: "function", id: "foo", params: [param1, param2] }; // foo(x,y)
  const func2: FunctionCall = { type: "function", id: "tuu", params: [param1, param2] }; // foo(x,y)
  const modified_func1: FunctionCall = { type: "function", id: "foo", params: [func1, param2] }; // foo(foo(x,y),y)
  const modified_func2: FunctionCall = { type: "function", id: "foo", params: [func2, param2] }; // foo(tuu(x,y),y)

  const init_knowledge: RawParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: modified_func2, // foo(tuu(x,y),y)
  };

  const parti: Participant = new Participant("Alice");
  parti.setKnowledge(init_knowledge);

  const result1 = knowledgeHandler.isFunctionKnown(parti, modified_func1, undefined); // foo(foo(x,y),y) => foo(tuu(x,y),y)?

  expect(result1).toBeTruthy();
});

test("Construct an EquationMap with functions with nested left functions", () => {
  const init_param1: Type = { type: "id", value: "a" };
  const init_param2: Type = { type: "id", value: "b" };
  const init_func1: FunctionCall = { type: "function", id: "foo", params: [init_param1, init_param2] }; // foo(a,b)
  const init_func2: FunctionCall = { type: "function", id: "lee", params: [init_param1, init_param2] }; // lee(a,b)

  const knowledgeHandler = new KnowledgeHandler();
  knowledgeHandler.getEquations().addEquation(init_func1, init_func2); // foo(a,b) => lee(a,b)

  const param1: Type = { type: "id", value: "x" };
  const param2: Type = { type: "id", value: "y" };

  const help_func1: FunctionCall = { type: "function", id: "foo", params: [param1, param2] }; // foo(x,y)
  const help_func2: FunctionCall = { type: "function", id: "lee", params: [param1, param2] }; // lee(x,y)
  const modified_func1: FunctionCall = { type: "function", id: "foo", params: [help_func2, param2] }; // foo(lee(x,y),y))
  const modified_func2: FunctionCall = { type: "function", id: "foo", params: [help_func1, param2] }; // foo(foo(x,y),y))

  const init_knowledge: RawParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: modified_func1,
  };

  const parti: Participant = new Participant("Alice");
  parti.setKnowledge(init_knowledge);

  const result = knowledgeHandler.isFunctionKnown(parti, modified_func2, undefined);

  expect(result).toBeTruthy();
});

test("Construct an EquationMap with functions with multiple steps", () => {
  const init_param1: Type = { type: "id", value: "a" };
  const init_param2: Type = { type: "id", value: "b" };
  const init_func1: FunctionCall = { type: "function", id: "foo", params: [init_param1, init_param2] }; // foo(a,b)
  const init_func2: FunctionCall = { type: "function", id: "lee", params: [init_param1, init_param2] }; // lee(a,b)
  const init_func3: FunctionCall = { type: "function", id: "gaa", params: [init_param1, init_param2] }; // gaa(a,b)
  const init_func4: FunctionCall = { type: "function", id: "tuu", params: [init_param1, init_param2] }; // tuu(a,b)

  const knowledgeHandler = new KnowledgeHandler();
  knowledgeHandler.getEquations().addEquation(init_func1, init_func2); // foo(a,b) => lee(a,b)
  knowledgeHandler.getEquations().addEquation(init_func2, init_func3); // lee(a,b) => gaa(a,b)
  knowledgeHandler.getEquations().addEquation(init_func3, init_func4); // gaa(a,b) => tuu(a,b)

  const param1: Type = { type: "id", value: "x" };
  const param2: Type = { type: "id", value: "y" };

  const func1: FunctionCall = { type: "function", id: "foo", params: [param1, param2] }; // foo(x,y)
  const func2: FunctionCall = { type: "function", id: "tuu", params: [param1, param2] }; // tuu(x,y)

  const init_knowledge: RawParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: func2,
  };

  const parti: Participant = new Participant("Alice");
  parti.setKnowledge(init_knowledge);

  const result = knowledgeHandler.isFunctionKnown(parti, func1, undefined);

  expect(result).toBeTruthy();
});

test("Does equalityMap.isFunctionKnown work with string values?", () => {
  const init_param1: Type = { type: "id", value: "a" };
  const init_param2: Type = { type: "id", value: "b" };
  const init_func1: FunctionCall = { type: "function", id: "foo", params: [init_param1, init_param2] }; // foo(a,b)
  const init_func2: FunctionCall = { type: "function", id: "lee", params: [init_param1, init_param2] }; // lee(a,b)

  const knowledgeHandler = new KnowledgeHandler();
  knowledgeHandler.getEquations().addEquation(init_func1, init_func2); // foo(a,b) => lee(a,b)

  const param1: Type = { type: "id", value: "x" };
  const param2: Type = { type: "id", value: "y" };

  const help_func1: FunctionCall = { type: "function", id: "foo", params: [param1, param2] }; // foo(x,y)
  const help_func2: FunctionCall = { type: "function", id: "lee", params: [param1, param2] }; // lee(x,y)
  const modified_func1: FunctionCall = { type: "function", id: "foo", params: [help_func2, param2] }; // foo(lee(x,y),y))
  const modified_func2: FunctionCall = { type: "function", id: "foo", params: [help_func1, param2] }; // foo(foo(x,y),y))

  const init_knowledge_value: Type = {
    type: "string",
    value: "this_is_a_value",
  };
  const init_knowledge: RawParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: modified_func1,
    value: init_knowledge_value,
  };

  const init_knowledge2: RawParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: modified_func1,
  };

  const parti: Participant = new Participant("Alice");
  parti.setKnowledge(init_knowledge);

  const parti2: Participant = new Participant("Alice2");
  parti2.setKnowledge(init_knowledge2);

  const result = knowledgeHandler.isFunctionKnown(parti, modified_func2, init_knowledge_value);
  const result2 = knowledgeHandler.isFunctionKnown(parti2, modified_func2, init_knowledge_value);

  expect(result).toBeTruthy();
  expect(result2).toBeFalsy();
});

test("Does equalityMap.isFunctionKnown work with function values?", () => {
  const init_param1: Type = { type: "id", value: "a" };
  const init_param2: Type = { type: "id", value: "b" };
  const init_func1: FunctionCall = { type: "function", id: "foo", params: [init_param1, init_param2] }; // foo(a,b)
  const init_func2: FunctionCall = { type: "function", id: "lee", params: [init_param1, init_param2] }; // lee(a,b)

  const knowledgeHandler = new KnowledgeHandler();
  knowledgeHandler.getEquations().addEquation(init_func1, init_func2); // foo(a,b) => lee(a,b)

  const param1: Type = { type: "id", value: "x" };
  const param2: Type = { type: "id", value: "y" };

  const help_func1: FunctionCall = { type: "function", id: "foo", params: [param1, param2] }; // foo(x,y)
  const help_func2: FunctionCall = { type: "function", id: "lee", params: [param1, param2] }; // lee(x,y)
  const modified_func1: FunctionCall = { type: "function", id: "foo", params: [help_func2, param2] }; // foo(lee(x,y),y))
  const modified_func2: FunctionCall = { type: "function", id: "foo", params: [help_func1, param2] }; // foo(foo(x,y),y))

  const init_knowledge_knowledge: Id = {
    type: "id",
    value: "this_is_a_value",
  };
  const init_knowledge1: RawParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: init_knowledge_knowledge,
    value: modified_func1,
  };

  const init_knowledge2: RawParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: init_knowledge_knowledge,
    value: modified_func2,
  };

  const parti: Participant = new Participant("Alice");
  parti.setKnowledge(init_knowledge1);

  const parti2: Participant = new Participant("Alice2");
  parti2.setKnowledge(init_knowledge2);

  const result = knowledgeHandler.doesParticipantKnow(parti, init_knowledge2);
  const result2 = knowledgeHandler.doesParticipantKnow(parti2, init_knowledge2);

  expect(result).toBeTruthy();
  expect(result2).toBeTruthy();
});

test("Does participant know opaque function?", () => {
  const init_param1: Type = { type: "id", value: "a" };
  const init_param2: Type = { type: "id", value: "b" };
  const init_func1: FunctionCall = { type: "function", id: "foo", params: [init_param1, init_param2] }; // foo(a,b)
  const init_func2: FunctionCall = { type: "function", id: "foo", params: [init_param2, init_param1] }; // foo(b,a)

  const knowledgeHandler = new KnowledgeHandler();
  knowledgeHandler.getEquations().addEquation(init_func1, init_func2); // foo(a,b) => foo(b,a)
  knowledgeHandler.addOpaqueFunction("foo");

  const param1: Type = { type: "id", value: "x" };
  const param2: Type = { type: "id", value: "y" };

  const func1: FunctionCall = { type: "function", id: "foo", params: [param1, param2] }; // foo(x,y)
  const func1_modified: FunctionCall = { type: "function", id: "foo", params: [param2, param1] }; // foo(y,x)

  const init_knowledge: RawParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: func1,
  };

  const init_param_knowledge1: RawParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: param1,
  };
  const init_param_knowledge2: RawParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: param2,
  };

  const init_modified_knowledge: RawParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: func1_modified,
  };

  // Alice knows foo(x,y)
  const parti: Participant = new Participant("Alice");
  parti.setKnowledge(init_knowledge);

  // Alice2 knows x and y
  const param_parti: Participant = new Participant("Alice2");
  param_parti.setKnowledge(init_param_knowledge1);
  param_parti.setKnowledge(init_param_knowledge2);

  // Alice3 knows foo(y,x)
  const modified_parti: Participant = new Participant("Alice");
  modified_parti.setKnowledge(init_modified_knowledge);

  const result = knowledgeHandler.isFunctionKnown(parti, func1, undefined);
  const result2 = knowledgeHandler.isFunctionKnown(param_parti, func1, undefined);
  const result3 = knowledgeHandler.isFunctionKnown(modified_parti, func1, undefined);

  expect(result).toBeTruthy();
  expect(result2).toBeFalsy();
  expect(result3).toBeTruthy();
});


test("Does participant know id and function with keyRelation?", () => {
  const init_param1: Type = { type: "id", value: "a" };
  const init_param2: Type = { type: "id", value: "b" };
  const init_func1: FunctionCall = { type: "function", id: "foo", params: [init_param1, init_param2] }; // foo(a,b)
  const init_func2: FunctionCall = { type: "function", id: "lee", params: [init_param1, init_param2] }; // lee(a,b)

  const knowledgeHandler = new KnowledgeHandler();
  knowledgeHandler.getEquations().addEquation(init_func1, init_func2); // foo(a,b) => lee(a,b)
  knowledgeHandler.addOpaqueFunction("foo");

  const param1_pk: Type = { type: "id", value: "x_pk" };
  const param2_pk: Type = { type: "id", value: "y_pk" };

  const param1_sk: Type = { type: "id", value: "x_sk" };
  const param2_sk: Type = { type: "id", value: "y_sk" };
  knowledgeHandler.addKeyRelation(param1_pk.value, param1_sk.value);
  knowledgeHandler.addKeyRelation(param2_pk.value, param2_sk.value);

  const func_pk: FunctionCall = { type: "function", id: "foo", params: [param1_pk, param2_pk] }; // foo(x,y)
  const func_modified_sk: FunctionCall = { type: "function", id: "lee", params: [param1_sk, param2_sk] }; // lee(x,y)

  const init_knowledge_funcWithPk: RawParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: func_pk,
  };

  const init_knowledge_param1_pk: RawParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: param1_pk,
  };
  const init_knowledge_param2_pk: RawParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: param2_pk,
  };

  const init_knowledge_param1_sk: RawParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: param1_sk,
  };
  const init_knowledge_param2_sk: RawParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: param2_sk,
  };

  const init_knowledge_func_modified_sk: RawParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: func_modified_sk,
  };

  // Bob knows foo(x_pk,y_pk)
  const parti_func1_pk: Participant = new Participant("Alice");
  parti_func1_pk.setKnowledge(init_knowledge_funcWithPk);

  // Bob knows x_pk and y_pk
  const parti_param1_param2_pk: Participant = new Participant("Bob");
  parti_param1_param2_pk.setKnowledge(init_knowledge_param1_pk);
  parti_param1_param2_pk.setKnowledge(init_knowledge_param2_pk);

  // Charlie knows x_sk and y_sk
  const parti_param1_param2_sk: Participant = new Participant("Charlie");
  parti_param1_param2_sk.setKnowledge(init_knowledge_param1_sk);
  parti_param1_param2_sk.setKnowledge(init_knowledge_param2_sk);

  // Delta knows lee(x_sk,y_sk)
  const parti_func_modified_sk: Participant = new Participant("Delta");
  parti_func_modified_sk.setKnowledge(init_knowledge_func_modified_sk);

  const result = knowledgeHandler.doesParticipantKnowKey(parti_func1_pk, init_knowledge_funcWithPk);
  const result2 = knowledgeHandler.doesParticipantKnowKey(parti_param1_param2_pk, init_knowledge_funcWithPk);
  const result3 = knowledgeHandler.doesParticipantKnowKey(parti_param1_param2_sk, init_knowledge_funcWithPk);
  const result4 = knowledgeHandler.doesParticipantKnowKey(parti_func_modified_sk, init_knowledge_funcWithPk);

  expect(result).toBeFalsy();
  expect(result2).toBeFalsy();
  expect(result3).toBeTruthy();
  expect(result4).toBeTruthy();
});