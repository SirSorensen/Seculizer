import { Program } from "$lib/models/program.js";
import { afterEach, assert, expect, test } from "vitest";
import { readFileSync } from "fs";
import {parse} from "$lang/index.js";
import type { Id, Type, FunctionCall } from "$lang/types/parser/interfaces";
import type { Frame } from "$lib/models/Frame";
import path from "path";
import { Latex } from "../src/lib/models/Latex";
import { fileURLToPath } from "url";
import { LatexMap } from "$lib/models/LatexMap";
import { Equal } from "$lib/models/Equal";
import { EquationMap } from "$lib/models/EquationMap";
import type { ParticipantKnowledge, RawParticipantKnowledge } from "src/types/participant";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const examplesFolder = path.resolve(__dirname, "../../specification/Examples");
let program: Program;

function startFunction(str: string) {
  if (typeof str == "string" && str == "") throw new Error('No test file given! (str == ""');

  let relativePath = path.resolve(examplesFolder, str + ".sepo");
  let fileStr = readFileSync(relativePath);
  let json = parse(fileStr, false);

  program = new Program(json, false);
}

let undefinedProgram: Program;
afterEach(() => {
  program = undefinedProgram;
});

test("web/program with simple.sepo", () => {
  startFunction("simple");
  expect(program).toBeDefined();

  expect(program.keyRelations).toBeDefined();
  expect(Object.keys(program.keyRelations).length).toBeGreaterThan(0);

  expect(program.functions).toBeDefined();
  expect(Object.keys(program.functions).length).toBeGreaterThan(0);

  expect(program.formats).toBeDefined();
  expect(Object.keys(program.formats).length).toBeGreaterThan(0);

  expect(Object.keys(program.equations).length).toBeGreaterThan(0);

  expect((program.icons.size)).toBe(0);
});

test("web/program with TPM.sepo", () => {
  startFunction("TPM");
  expect(program).toBeDefined();
});

test("web/program with key-relation.sepo", () => {
  startFunction("key-relation");
  expect(program).toBeTruthy();
});

test("web/program with DF.sepo", () => {
  startFunction("DF");
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
  expect((program.icons.size)).toBe(7);
});

test("web/program with send-with-sign.sepo", () => {
  startFunction("send-with-sign");
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
  let first = program.first as Frame;

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
    value: "",
  };

  const msg_B: ParticipantKnowledge = {
    type: "rawKnowledge",
    knowledge: {
      type: "id",
      value: "msg_B",
    },
    value: "",
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
  startFunction("send");
  expect(program).toBeTruthy();
});

test("web/program with send-with-enc.sepo", () => {
  startFunction("send-with-enc");
  expect(program).toBeTruthy();
});

test("web/program with send-and-clear.sepo", () => {
  startFunction("send-and-clear");
  expect(program).toBeTruthy();
  let last = program.first?.getLast();
  expect(last).toBeTruthy();
  expect(last).toBeDefined();
  last = last as Frame;

  expect(last.getParticipantMap().getParticipants()).toBeDefined();

  let amountOfParticipants = last.getParticipantMap().getParticipantAmount();
  expect(amountOfParticipants).toBe(3);

  let alice = last.getParticipantMap().getParticipant("Alice");
  expect(alice).toBeDefined();

  expect(alice?.getKnowledgeList().length).toBe(0);
});

test("web/Program with icon-test.sepo", () => {
  startFunction("icon-test");
  expect(program).toBeTruthy();
  expect(program.icons).toBeTruthy();
  expect(program.icons.size).toBe(5);
  const id: Id = { type: "id", value: "Alice" };
  const icon = program.icons.get(id.value);
  expect(icon).toBeTruthy();
  expect(icon).toBe("woman");
});

test("web/Program with clear.sepo", () => {
  startFunction("clear");
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
  let init_param1: Type = { type: "id", value: "x" };
  let init_param2: Type = { type: "id", value: "y" };
  let init_func: FunctionCall = { type: "function", id: "Hash", params: [init_param1, init_param2] };

  let latex = new Latex(init_func, "$Hash(x||y||x)$");

  let param1: Type = { type: "id", value: "z" };
  let param2: Type = { type: "number", value: 5 };
  let func: FunctionCall = { type: "function", id: "Hash", params: [param1, param2] };

  let result = latex.constructLatex(func);

  expect(result).toBe("$Hash(\\text{z}||5||\\text{z})$");
});


test("Make LatexMap and call a function with embedded function", () => {
    let init_param1: Type = { type: "id", value: "x" };
    let init_param2: Type = { type: "id", value: "y" };
    let init_func1: FunctionCall = { type: "function", id: "Hash", params: [init_param1, init_param2] };
    let init_func2: FunctionCall = { type: "function", id: "Base", params: [init_param1, init_param2] };

    let latexMap = new LatexMap();
    latexMap.addLatex(init_func1, "$Hash(x||y||x)$");
    latexMap.addLatex(init_func2, "$Based_{XXX}(y&&x)$");

    let param1: Type = { type: "id", value: "z" };
    let param2: Type = { type: "number", value: 5 };
    let param3: Type = { type: "string", value: "Jesus" };
    let func1: FunctionCall = { type: "function", id: "Hash", params: [param1, param2] };
    let func2: FunctionCall = { type: "function", id: "Base", params: [param3, func1] };


    let result = latexMap.getConstructedLatex(func2);

    expect(result).toBe("$Based_{XXX}({Hash(\\text{z}||5||\\text{z})}&&\\text{Jesus})$");

})


test("Construct an Equal and call generateEqual", () => {
  let init_param1: Type = { type: "id", value: "x" };
  let init_param2: Type = { type: "id", value: "y" };
  let init_func1: FunctionCall = { type: "function", id: "Hash", params: [init_param1, init_param2] };
  let init_func2: FunctionCall = { type: "function", id: "Base", params: [init_param2, init_param1] };

  let equality = new Equal(init_func1, init_func2);

  let param1: Type = { type: "id", value: "z" };
  let param2: Type = { type: "id", value: "v" };
  let func: FunctionCall = { type: "function", id: "Hash", params: [param1, param2] };


  let result = equality.generateEqual(func);
  let expected: FunctionCall = { type: "function", id: "Base", params: [param2, param1] };
  
  expect(result.id).toBe(expected.id);
  expect(result.type).toBe(expected.type);
  expect(result.params[0]).toBe(expected.params[0]);
  expect(result.params[1]).toBe(expected.params[1]);
})

test("Construct an Equal and call generateEqual with embedded functions", () => {
  let init_param1: Type = { type: "id", value: "x" };
  let init_param2: Type = { type: "id", value: "y" };
  let init_param3: Type = { type: "id", value: "z" };

  let init_func1: FunctionCall = { type: "function", id: "exp", params: [init_param2, init_param3] };
  let init_func2: FunctionCall = { type: "function", id: "exp", params: [init_param1, init_func1] };

  let init_func3: FunctionCall = { type: "function", id: "exp", params: [init_param3, init_param2] };
  let init_func4: FunctionCall = { type: "function", id: "exp", params: [init_param1, init_func3] };

  let equality = new Equal(init_func2, init_func4);

  let param1: Type = { type: "id", value: "a" };
  let param2: Type = { type: "id", value: "b" };
  let param3: Type = { type: "id", value: "c" };
  let func1: FunctionCall = { type: "function", id: "exp", params: [param2, param3] };
  let func2: FunctionCall = { type: "function", id: "exp", params: [param1, func1] };

  let result = equality.generateEqual(func2);
  let tmp_expected: FunctionCall = { type: "function", id: "exp", params: [param3, param2] };
  let expected: FunctionCall = { type: "function", id: "exp", params: [param1, tmp_expected] };


  expect(result.id).toBe(expected.id);
  expect(result.type).toBe(expected.type);
  expect(result.params[0]).toBe(expected.params[0]);
  if (result.params[1].type == "function" && expected.params[1].type == "function") {
    expect(result.params[1].params[0]).toBe(expected.params[1].params[0]);
    expect(result.params[1].params[1]).toBe(expected.params[1].params[1]);
  }
});

test("Construct an EquationMap and call generateEquals", () => {
  let init_param1: Type = { type: "id", value: "x" };
  let init_param2: Type = { type: "id", value: "y" };
  let init_func1: FunctionCall = { type: "function", id: "Hash", params: [init_param1, init_param2] }; // Hash(x,y)
  let init_func2: FunctionCall = { type: "function", id: "Hash", params: [init_param2, init_param1] }; // Hash(y,x)

  let init_func3: FunctionCall = { type: "function", id: "Base", params: [init_param1, init_param2] }; // Base(x,y)
  let init_func4: FunctionCall = { type: "function", id: "Base", params: [init_param2, init_param1] }; // Base(y,x)

  let equalityMap = new EquationMap();
  equalityMap.addEquation(init_func1, init_func2);
  equalityMap.addEquation(init_func3, init_func4);

  let param1: Type = { type: "id", value: "z" };
  let param2: Type = { type: "id", value: "v" };
  
  let func: FunctionCall = { type: "function", id: "Hash", params: [param1, param2] }; // Hash(z,v)

  let result = equalityMap.generateEquals(func);
  let expected: FunctionCall[] = [
  { type: "function", id: "Hash", params: [param2, param1] }, // Base(v,z)
  func
  ]

  expect(result.length).toBe(2);
  expect(result[0].id).toBe(expected[0].id);
  expect(result[0].type).toBe(expected[0].type);
  expect(result[0].params[0]).toBe(expected[0].params[0]);
  expect(result[0].params[1]).toBe(expected[0].params[1]);
  expect(result[1].id).toBe(expected[1].id);
  expect(result[1].type).toBe(expected[1].type);
  expect(result[1].params[0]).toBe(expected[1].params[0]);
  expect(result[1].params[1]).toBe(expected[1].params[1]);
});

test("Construct an EquationMap with multiple of the same fiunction and call generateEquals", () => {
  let init_param1: Type = { type: "id", value: "x" };
  let init_param2: Type = { type: "id", value: "y" };
  let init_func1: FunctionCall = { type: "function", id: "Hash", params: [init_param1, init_param2] }; // Hash(x, y)
  let init_func2: FunctionCall = { type: "function", id: "Hash", params: [init_param2, init_param1] }; // Hash(y, x)
  let init_func3: FunctionCall = { type: "function", id: "Hash", params: [init_param1, init_param1] }; // Hash(x, x)

  let equalityMap = new EquationMap();
  equalityMap.addEquation(init_func1, init_func2); // Hash(x, y) => Hash(y, x)
  equalityMap.addEquation(init_func1, init_func3); // Hash(x, y) => Hash(x, x)

  let param1: Type = { type: "id", value: "z" };
  let param2: Type = { type: "id", value: "v" };

  let func: FunctionCall = { type: "function", id: "Hash", params: [param1, param2] };

  let result = equalityMap.generateEquals(func);
  let expected: FunctionCall[] = [
    { type: "function", id: "Hash", params: [param2, param1] },
    { type: "function", id: "Hash", params: [param1, param1] },
    func,
  ];

  expect(result.length).toBe(expected.length);
  expect(result[0].id).toBe(expected[0].id);
  expect(result[0].type).toBe(expected[0].type);
  expect(result[0].params[0]).toBe(expected[0].params[0]);
  expect(result[0].params[1]).toBe(expected[0].params[1]);
  expect(result[1].id).toBe(expected[1].id);
  expect(result[1].type).toBe(expected[1].type);
  expect(result[1].params[0]).toBe(expected[1].params[0]);
  expect(result[1].params[1]).toBe(expected[1].params[1]);
  expect(result[2].id).toBe(expected[2].id);
  expect(result[2].type).toBe(expected[2].type);
  expect(result[2].params[0]).toBe(expected[2].params[0]);
  expect(result[2].params[1]).toBe(expected[2].params[1]);
});
